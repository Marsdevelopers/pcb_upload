// next.config.mjs
import dotenv from "dotenv";
import path from "path";

// ✅ Explicitly load the root .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

console.log("✅ Loaded .env in next.config.mjs");
console.log(
  "DEBUG: ADMIN_PASSWORD_HASH =",
  process.env.ADMIN_PASSWORD_HASH ? "✅ exists" : "❌ missing"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
    JWT_SECRET: process.env.JWT_SECRET || "fallback_secret",
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
