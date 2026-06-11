import type { NextConfig } from "next";

// GITHUB_PAGES=true produces a fully static export under the repo's
// GitHub Pages base path. Default build stays server-mode (Vercel-ready).
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath: "/Traton_BatteryAageingTutor-",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
