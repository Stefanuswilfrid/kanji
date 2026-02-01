
const nextConfig = {
  async rewrites() {
    return [
      // English lives at `/en/...` but we serve the same App Router routes at `/<path>`.
      // The browser URL stays `/en/...`.
      { source: "/en", destination: "/" },
      { source: "/en/:path*", destination: "/:path*" },
    ];
  },

  async redirects() {
    return [
      // Canonicalize Indonesian as the default locale: never keep `/id` in the URL.
      { source: "/id", destination: "/", permanent: false },
      { source: "/id/:path*", destination: "/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
