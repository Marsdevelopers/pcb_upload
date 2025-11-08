import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { supabase } from "@/lib/supabase";
import { sendTelegramNotification } from "@/lib/telegram";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";

export const bodyParser = false; // ✅ correct in App Router
export const maxBodySize = "10mb"; // ✅ allow larger uploads


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ Optional file-type check
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
        { status: 400 }
      );
    }

    // ✅ Convert file to Buffer and upload to Cloudinary
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

    // ✅ Save record in Supabase
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

    // ✅ Telegram alert
    await sendTelegramNotification({
      name,
      email,
      phone,
      notes,
      file_name: (uploadResult as any).original_filename,
    });

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
