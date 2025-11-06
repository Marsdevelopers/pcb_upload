"use client";
import React, { useState } from "react";
import { Upload, Send, User, Mail, Phone, FileText, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import cloudinary from "@/lib/cloudinary";
import { sendTelegramNotification } from "@/lib/telegram";

interface UploadFormProps {
  setView: (view: string) => void;
}

export function UploadForm({ setView }: UploadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validExtensions = [".gbr", ".zip", ".rar", ".gbl", ".gtl", ".gbs", ".gts"];
      const isValid = validExtensions.some((ext) => selectedFile.name.toLowerCase().endsWith(ext));
      if (!isValid) {
        setError("Please upload a valid Gerber file (.gbr, .zip, .rar)");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError("");
      }
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Upload file to Cloudinary
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", file);
      cloudinaryData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`, {
        method: "POST",
        body: cloudinaryData,
      });
      const cloudJson = await cloudRes.json();

      const fileUrl = cloudJson.secure_url;
      const fileName = file.name;

      // Store submission in Supabase
      const { data, error: supabaseError } = await supabaseAdmin.from("submissions").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes,
          file_name: fileName,
          file_url: fileUrl,
        },
      ]);

      if (supabaseError) throw supabaseError;

      // Send Telegram notification
      await sendTelegramNotification({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
        file_name: fileName,
      });

      // Reset form and show success
      setFormData({ name: "", email: "", phone: "", notes: "" });
      setFile(null);
      setView("success");
    } catch (err: any) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Upload Your PCB Design</h2>
          <p className="text-blue-100 mt-1">Submit your Gerber files for manufacturing</p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              <span>Phone Number *</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              <span>Additional Notes</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any special instructions or requirements..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Upload className="w-4 h-4" />
              <span>Gerber Files *</span>
            </label>
            <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{file ? file.name : "Click to upload Gerber files"}</p>
                <p className="text-xs text-gray-400 mt-1">Supports .gbr, .zip, .rar formats</p>
              </div>
            </label>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit PCB Design</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface SuccessMessageProps {
  setView: (view: string) => void;
}

export function SuccessMessage({ setView }: SuccessMessageProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Successful!</h2>
        <p className="text-gray-600 mb-8">
          Your PCB design has been submitted successfully. Our team will review it and contact you soon.
        </p>
        <button
          onClick={() => setView("form")}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
        >
          Submit Another Design
        </button>
      </div>
    </div>
  );
}
