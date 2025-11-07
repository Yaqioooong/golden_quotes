/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://8.153.82.10:8080/gq/api/:path*",
        // destination: "http://localhost:8080/gq/api/:path*",
      },
    ];
  },
};

export default nextConfig;
