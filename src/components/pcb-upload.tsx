"use client";
import React, { useState } from "react";
import { Upload, CheckCircle, Loader } from "lucide-react";

interface UploadFormProps {
  setView: (view: string) => void;
}

export function UploadForm({ setView }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first!");

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setView("success");
    }, 2000); // simulate upload delay
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Upload Your PCB Design
        </h2>
        <p className="text-gray-500 mb-6">
          Choose your Gerber or design file and submit it for review.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="file"
            accept=".zip,.rar,.7z"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 p-3 rounded-lg cursor-pointer focus:outline-none"
          />
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-70 flex items-center justify-center space-x-2"
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload File</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

interface SuccessMessageProps {
  setView: (view: string) => void;
}

export function SuccessMessage({ setView }: SuccessMessageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50 px-6 py-16">
      <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          File Uploaded Successfully!
        </h2>
        <p className="text-gray-500 mb-6">
          Our team will review your design and get back to you shortly.
        </p>
        <button
          onClick={() => setView("form")}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
        >
          Upload Another File
        </button>
      </div>
    </div>
  );
}
