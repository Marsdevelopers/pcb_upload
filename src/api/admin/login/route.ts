import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const hashedPassword = process.env.ADMIN_PASSWORD_HASH!;
    const jwtSecret = process.env.JWT_SECRET!;

    const valid = await bcrypt.compare(password, hashedPassword);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "1d" });

    return NextResponse.json({ token });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
