// src/lib/loadEnv.ts
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

export function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`✅ Loaded .env from: ${envPath}`);
  } else {
    console.error(`❌ .env not found at: ${envPath}`);
  }

  // Log only for debug — do not show hash in production
  if (!process.env.ADMIN_PASSWORD_HASH) {
    console.error("❌ ADMIN_PASSWORD_HASH not loaded");
  } else {
    console.log("✅ ADMIN_PASSWORD_HASH loaded (hidden)");
  }
}
