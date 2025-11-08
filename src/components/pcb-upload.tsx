"use client";
import React, { useState } from "react";

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
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file || !formData.name || !formData.email || !formData.phone) {
      setError("Please fill all required fields and select a file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("notes", formData.notes);
      data.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Upload failed");

      setFormData({ name: "", email: "", phone: "", notes: "" });
      setFile(null);
      setView("success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <p className="text-lg text-gray-600 max-w-2xl mb-10"> After submission our team will contact you no login required ! 
          For prototype & project development /pcb design please upload a pdf description or abstract Team will contact you. 
        </p>
        

        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-3 border mb-3 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-3 border mb-3 rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone *"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full p-3 border mb-3 rounded"
        />
        <textarea
          name="notes"
          placeholder="Additional notes"
          value={formData.notes}
          onChange={handleInputChange}
          className="w-full p-3 border mb-3 rounded"
          rows={3}
        />
        <input type="file" onChange={handleFileChange} className="mb-3" />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Submit PCB Design"}
        </button>
      </div>
    </div>
  );
}

export function SuccessMessage({ setView }: { setView: (view: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Upload Successful!</h2>
      <button
        onClick={() => setView("form")}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Submit Another Design
      </button>
    </div>
  );
}
