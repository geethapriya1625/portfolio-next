#!/usr/bin/env python3
"""Turn the raw intro video into the hero assets the site uses.

    python3 scripts/build-hero-assets.py path/to/intro.mp4 [--crop W:H:X:Y] [--portrait photo.jpg]

Outputs (into public/):
    hero/hero.mp4        H.264 yuv420p, CRF 24, AAC 96 kbps, +faststart
    hero/hero.webm       VP9 CRF 36, Opus 80 kbps
    portrait-bust.webp   480x600 head-to-shirt crop from the sharpest frame (or --portrait)
    og.jpg               1200x630 social card

Steps
  1. Find the person: every frame is decoded small, non-white pixels are unioned into one
     bounding box, and a crop with the hero's 768:960 aspect is centred on it (override with --crop).
  2. Whiten the backdrop with colorlevels so it melts into the page under mix-blend-mode: multiply.
  3. Seamless loop without retiming: the clip is played from 0.5 s to the end, and its last 0.5 s
     is cross-faded into its own first 0.5 s. The output therefore ends on exactly the frame it
     starts with. Video uses ffmpeg xfade; audio is cross-faded sample-accurately in numpy
     (equal-power), because acrossfade can drop audio at the boundary. Lips stay in sync because
     nothing is stretched.

Needs: ffmpeg (with libx264, libvpx-vp9, libopus), numpy, Pillow.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
FADE = 0.5  # seconds cross-faded at the loop seam
OUT_W, OUT_H = 768, 960  # hero aspect 768:960
SR = 48_000


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, check=True, **kw)


def probe(src: Path) -> dict:
    out = run(
        ["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(src)],
        capture_output=True,
    ).stdout
    return json.loads(out)


def video_frames(src: Path, w: int, h: int, scale: int = 1) -> np.ndarray:
    """Decode every frame as RGB (optionally downscaled by `scale`)."""
    sw, sh = w // scale, h // scale
    raw = run(
        ["ffmpeg", "-v", "error", "-i", str(src), "-vf", f"scale={sw}:{sh}",
         "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, sh, sw, 3)


def detect_crop(frames: np.ndarray, scale: int, w: int, h: int) -> tuple[int, int, int, int, tuple]:
    """Union bounding box of non-white pixels over all frames -> 768:960 crop centred on the person."""
    mask = (frames.min(axis=3) < 225).any(axis=0)
    # ignore a thin margin: encoders and screen recorders often leave a 1 px border line
    my, mx = max(1, mask.shape[0] // 50), max(1, mask.shape[1] // 50)
    mask[:my, :] = mask[-my:, :] = False
    mask[:, :mx] = mask[:, -mx:] = False
    ys, xs = np.nonzero(mask)
    if len(xs) == 0:
        sys.exit("could not find a person against the background; pass --crop W:H:X:Y")
    x0, x1, y0, y1 = xs.min() * scale, xs.max() * scale, ys.min() * scale, ys.max() * scale
    cx = (x0 + x1) / 2
    ch = h  # keep the full height: head to toe plus breathing room
    cw = int(round(ch * OUT_W / OUT_H)) // 2 * 2
    cx0 = int(round(min(max(cx - cw / 2, 0), w - cw))) // 2 * 2
    return cw, ch, cx0, 0, (x0, y0, x1, y1)


def build_video(src: Path, crop: str, frames_n: int, fps: float, tmp: Path) -> Path:
    dur = frames_n / fps
    body_len = dur - FADE
    out = tmp / "loop.mkv"
    graph = (
        f"[0:v]crop={crop},scale={OUT_W}:{OUT_H}:flags=lanczos,"
        f"colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,setsar=1,split[a][b];"
        f"[a]trim=start={FADE}:end={dur},setpts=PTS-STARTPTS[body];"
        f"[b]trim=start=0:end={FADE},setpts=PTS-STARTPTS[head];"
        f"[body][head]xfade=transition=fade:duration={FADE}:offset={body_len - FADE},format=yuv420p[v]"
    )
    run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-filter_complex", graph,
         "-map", "[v]", "-an", "-c:v", "ffv1", str(out)])
    return out


def build_audio(src: Path, frames_n: int, fps: float, tmp: Path) -> Path:
    raw = run(
        ["ffmpeg", "-v", "error", "-i", str(src), "-vn", "-ac", "2", "-ar", str(SR),
         "-f", "f32le", "-"],
        capture_output=True,
    ).stdout
    a = np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
    dur = frames_n / fps
    n_total = int(round(dur * SR))
    if len(a) < n_total:  # pad if audio is a hair shorter than the picture
        a = np.vstack([a, np.zeros((n_total - len(a), 2), np.float32)])
    a = a[:n_total]
    f = int(round(FADE * SR))
    body = a[f:].copy()  # 0.5 s .. end
    head = a[:f]
    t = np.linspace(0.0, 1.0, f, endpoint=False, dtype=np.float32)[:, None]
    fade_out, fade_in = np.cos(t * np.pi / 2), np.sin(t * np.pi / 2)  # equal-power
    body[-f:] = body[-f:] * fade_out + head * fade_in
    pcm = (np.clip(body, -1, 1) * 32767).astype("<i2")
    out = tmp / "loop.wav"
    with wave.open(str(out), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())
    return out


def encode(video: Path, audio: Path) -> None:
    hero = PUBLIC / "hero"
    hero.mkdir(parents=True, exist_ok=True)
    run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", str(audio),
         "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "24", "-preset", "slow",
         "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "aac", "-b:a", "96k",
         "-movflags", "+faststart", "-shortest", str(hero / "hero.mp4")])
    run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", str(audio),
         "-map", "0:v", "-map", "1:a", "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0",
         "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
         "-c:a", "libopus", "-b:a", "80k", "-shortest", str(hero / "hero.webm")])


def sharpest_frame(frames: np.ndarray, region: tuple[int, int, int, int]) -> int:
    x0, y0, x1, y1 = region
    scores = []
    for fr in frames:
        g = fr[y0:y1, x0:x1].mean(axis=2)
        lap = g[1:-1, 1:-1] * 4 - g[:-2, 1:-1] - g[2:, 1:-1] - g[1:-1, :-2] - g[1:-1, 2:]
        scores.append(lap.var())
    return int(np.argmax(scores))


def build_stills(src: Path, w: int, h: int, bbox: tuple, portrait: Path | None) -> Image.Image:
    x0, y0, x1, y1 = bbox
    person_h = y1 - y0
    if portrait:
        im = Image.open(portrait).convert("RGB")
        tw = min(im.width, int(im.height * 0.8))
        th = int(tw / 0.8)
        bust = im.crop(((im.width - tw) // 2, 0, (im.width + tw) // 2, th))
    else:
        frames = video_frames(src, w, h)
        bust_h = int(person_h * 0.34)
        bust_w = int(bust_h * 480 / 600)
        top = max(y0 - int(bust_h * 0.06), 0)
        # centre on the head: columns that are non-white in the top 12% of the figure
        head = frames[:, y0:y0 + int(person_h * 0.12), x0:x1].min(axis=3) < 200
        cols = np.nonzero(head.any(axis=(0, 1)))[0]
        hcx = x0 + (cols.min() + cols.max()) / 2 if len(cols) else (x0 + x1) / 2
        left = int(min(max(hcx - bust_w / 2, 0), w - bust_w))
        idx = sharpest_frame(frames, (left, top, left + bust_w, top + bust_h))
        bust = Image.fromarray(frames[idx]).crop((left, top, left + bust_w, top + bust_h))
    bust = bust.resize((480, 600), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2, 60, 2))
    bust.save(PUBLIC / "portrait-bust.webp", "WEBP", quality=88, method=6)
    return bust


def build_og(bust: Image.Image) -> None:
    W, H = 1200, 630
    og = Image.new("RGB", (W, H), "#f4f2ee")
    d = ImageDraw.Draw(og)
    fonts = ROOT / "src" / "fonts"
    try:
        big = ImageFont.truetype(str(fonts / "InterTight-Variable.woff2"), 76)
        mid = ImageFont.truetype(str(fonts / "InterTight-Variable.woff2"), 34)
        mono = ImageFont.truetype(str(fonts / "JetBrainsMono-Variable.woff2"), 24)
    except OSError:
        big = mid = mono = ImageFont.load_default()
    portrait = bust.resize((360, 450), Image.LANCZOS)
    og.paste(portrait, (W - 360 - 80, (H - 450) // 2))
    d.text((80, 150), "GEETHA PRIYA KANIKIREDDY", font=mono, fill="#77756f")
    d.text((80, 200), "Full Stack", font=big, fill="#0d0d0d")
    d.text((80, 285), "Software Engineer.", font=big, fill="#0d0d0d")
    d.text((80, 400), "Java · Spring Boot · Python · React · LLM & RAG", font=mid, fill="#3a3a3a")
    d.text((80, 470), "Atlanta, GA", font=mono, fill="#77756f")
    og.save(PUBLIC / "og.jpg", "JPEG", quality=88, optimize=True, progressive=True)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video", type=Path)
    ap.add_argument("--crop", help="override detected crop, ffmpeg syntax W:H:X:Y")
    ap.add_argument("--portrait", type=Path, help="photo to use for the portrait instead of a video frame")
    args = ap.parse_args()
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg not found")

    info = probe(args.video)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    w, h = int(v["width"]), int(v["height"])
    num, den = map(int, v["r_frame_rate"].split("/"))
    fps = num / den

    small = video_frames(args.video, w, h, scale=4)
    frames_n = len(small)
    cw, ch, cx, cy, bbox = detect_crop(small, 4, w, h)
    crop = args.crop or f"{cw}:{ch}:{cx}:{cy}"
    print(f"source {w}x{h} @ {fps:g} fps, {frames_n} frames ({frames_n / fps:.2f}s)")
    print(f"person bbox {bbox} -> crop {crop}")

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        vid = build_video(args.video, crop, frames_n, fps, tmp)
        aud = build_audio(args.video, frames_n, fps, tmp)
        encode(vid, aud)

    # poster = first frame of the finished loop, shown before the video can play
    run(["ffmpeg", "-v", "error", "-y", "-i", str(PUBLIC / "hero" / "hero.mp4"), "-frames:v", "1",
         "-c:v", "libwebp", "-quality", "82", str(PUBLIC / "hero" / "poster.webp")])
    bust = build_stills(args.video, w, h, bbox, args.portrait)
    build_og(bust)
    for p in [PUBLIC / "hero" / "hero.mp4", PUBLIC / "hero" / "hero.webm", PUBLIC / "hero" / "poster.webp",
              PUBLIC / "portrait-bust.webp", PUBLIC / "og.jpg"]:
        print(f"{p.relative_to(ROOT)}  {p.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
