/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy — scoped to exactly what this project needs:
//  - 'self' for the app's own scripts/styles/assets
//  - 'unsafe-inline' on script-src: required by Next.js App Router, which
//    streams RSC/hydration payloads via inline <script> tags at runtime
//  - 'unsafe-eval' on script-src: only added in development, where webpack's
//    Fast Refresh/HMR relies on eval(); production builds don't need it
//  - 'unsafe-inline' on style-src: required because several components use
//    inline style={{...}} (e.g. Avatar, ServiceIcon, admin color/rating
//    fields), which CSP governs the same way as inline <style> blocks
//  - img-src allows Supabase Storage + Unsplash placeholders (both already
//    allowlisted below for next/image) plus blob:/data: for local upload
//    previews (FileUploadField uses URL.createObjectURL for instant preview)
//  - connect-src allows Supabase's REST/Auth/Storage API
//  - frame-src allows the YouTube embeds used on project detail pages
const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "frame-src 'self' https://www.youtube.com https://youtube.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  // Defense-in-depth alongside CSP's frame-ancestors, for older browsers
  // that don't support that CSP directive.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), midi=(), sync-xhr=(), fullscreen=(self "https://www.youtube.com")',
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
