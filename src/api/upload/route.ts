import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabase";
import { sendTelegramNotification } from "@/lib/telegram";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" });
    }

    // Convert the uploaded file to a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the file to Cloudinary
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "pcb_uploads",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const fileUrl = uploadResponse.secure_url;
    const fileName = uploadResponse.original_filename;

    // Save submission to Supabase (admin view)
    const { error: dbError } = await supabaseAdmin.from("uploads").insert([
      {
        name,
        email,
        phone,
        notes,
        file_name: fileName,
        file_url: fileUrl,
        created_at: new Date().toISOString(),
      },
    ]);

    if (dbError) throw dbError;

    // Send Telegram notification to admin
    await sendTelegramNotification({
      name,
      email,
      phone,
      notes,
      file_name: fileName,
    });

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully!",
      fileUrl,
    });
  } catch (error: any) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
