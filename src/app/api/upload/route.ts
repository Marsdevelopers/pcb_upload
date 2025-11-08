import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { supabase } from "@/lib/supabase";
import { sendTelegramNotification } from "@/lib/telegram";

// ✅ Server runtime config for file uploads
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";
export const maxDuration = 60;
export const bodyParser = false;
export const maxBodySize = "20mb"; // allow larger uploads

// ✅ Ensure Vercel doesn't limit body size
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "20mb",
  },
};

// ✅ Add CORS headers so Chrome mobile doesn't block requests
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// ✅ Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// ✅ Handle file upload
export async function POST(req: Request) {
  try {
    console.log("Incoming upload request:", req.headers.get("user-agent"));

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // ✅ Convert file to Buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "pcb_uploads",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    // ✅ Store submission in Supabase
    const { data, error } = await supabase
      .from("submissions")
      .insert([
        {
          name,
          email,
          phone,
          notes,
          file_name: (uploadResult as any).original_filename,
          file_url: (uploadResult as any).secure_url,
        },
      ])
      .select();

    if (error) throw error;

    // ✅ Send Telegram notification
    await sendTelegramNotification({
      name,
      email,
      phone,
      notes,
      file_name: (uploadResult as any).original_filename,
    });

    return NextResponse.json(
      { success: true, message: "File uploaded successfully" },
      { status: 200, headers: corsHeaders() }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
