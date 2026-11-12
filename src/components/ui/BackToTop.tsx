"use client";

import { scrollToTarget } from "@/lib/scroll";

export default function BackToTop() {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault();
        scrollToTarget("top");
      }}
    >
      Back to top ↑
    </a>
  );
}
