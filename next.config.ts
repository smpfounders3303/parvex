import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // Unsplash serves pre-optimized images via their own CDN query params
    // (w=, q=, auto=format). Next.js optimization is still active so local
    // and Cloudinary images are processed normally. If you see ECONNRESET
    // errors for specific Unsplash images, add `unoptimized` on that
    // individual <Image> component instead of disabling it globally.
  },
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
