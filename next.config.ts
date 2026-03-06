import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent the page from being embedded in iframes (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control how much referrer information is sent
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Enforce HTTPS for 1 year, including subdomains
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Restrict browser feature access; voice demo requires microphone on same origin
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=()",
  },
  // Content Security Policy – allows Vercel Analytics and same-origin resources
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Inline scripts required by Next.js hydration and Vercel Analytics
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      // Inline styles required by Tailwind CSS
      "style-src 'self' 'unsafe-inline'",
      // Self-hosted fonts (next/font downloads and serves fonts locally)
      "font-src 'self'",
      // Images: same origin, data URIs, and QR code service
      "img-src 'self' data: https://api.qrserver.com",
      // API calls: same origin, Ultravox API, and Vercel Analytics endpoint
      "connect-src 'self' https://api.ultravox.ai wss://*.ultravox.ai https://va.vercel-scripts.com",
      // No plugin objects
      "object-src 'none'",
      // Prevent mixed content
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/v1/create-qr-code/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
