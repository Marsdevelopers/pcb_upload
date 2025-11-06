import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    // Optional: Check for admin authentication (JWT token)
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    // verify token if needed (you can do that later using JWT_SECRET)

    // Fetch from Supabase
    const { data, error } = await supabaseAdmin
      .from("pcb_uploads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ submissions: data });
  } catch (err: any) {
    console.error("Error fetching submissions:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
