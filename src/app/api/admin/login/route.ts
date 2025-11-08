import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// Try environment variable first (for Vercel)
let ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Fallback for local development (manual .env read)
if (!ADMIN_PASSWORD_HASH) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    const envContent = fs.readFileSync(envPath, "utf8");
    const match = envContent.match(/^ADMIN_PASSWORD_HASH=(.*)$/m);
    if (match) ADMIN_PASSWORD_HASH = match[1].trim();
    console.log("✅ Loaded ADMIN_PASSWORD_HASH from .env manually");
  } catch (err) {
    console.error("⚠️ Failed to read .env file manually:", err);
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!ADMIN_PASSWORD_HASH) {
      console.error("❌ ADMIN_PASSWORD_HASH missing in runtime");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_token", token, { httpOnly: true, maxAge: 3600 });
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
