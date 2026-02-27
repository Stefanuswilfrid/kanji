const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        hostname: "api-cdn.dioco.io",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
      {
        hostname: "res.cloudinary.com",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
