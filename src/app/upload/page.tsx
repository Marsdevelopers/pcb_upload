"use client";
import React, { useState } from "react";
import { UploadForm, SuccessMessage } from "@/components/pcb-upload"; // we'll extract them below

export default function UploadPage() {
  const [view, setView] = useState("form");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {view === "form" && <UploadForm setView={setView} />}
      {view === "success" && <SuccessMessage setView={setView} />}
    </div>
  );
}
