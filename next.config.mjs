/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  // output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  }
};

export default nextConfig;
