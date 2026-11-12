import type { NextConfig } from "next";

// Static export so the site can be hosted on GitHub Pages (or any static host).
// For a project page such as https://<user>.github.io/<repo>, build with
// NEXT_PUBLIC_BASE_PATH=/<repo>. Leave it empty for a root domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
