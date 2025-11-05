"use client";
import React from "react";
import Link from "next/link";
import { FileText, UploadCloud } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">PCB Express</h1>
          </div>
          <Link
            href="/upload"
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
          >
            Upload PCB Design
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Fast & Reliable PCB Manufacturing
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-10">
          We provide professional PCB fabrication and assembly services for hobbyists, startups, and enterprises.
          Upload your Gerber files and get instant quotes, fast delivery, and industry-grade quality.
        </p>
        <Link
          href="/upload"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition"
        >
          <UploadCloud className="w-5 h-5" />
          <span>Submit PCB Design</span>
        </Link>
      </main>

      {/* Services Section */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "Prototype to Production",
              desc: "Whether you need a single prototype or mass production, we handle it efficiently.",
            },
            {
              title: "Quality Assurance",
              desc: "All PCBs undergo strict inspection and testing for optimal performance.",
            },
            {
              title: "Fast Turnaround",
              desc: "Get your boards manufactured and delivered quickly without compromising quality.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {s.title}
              </h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} PCB Express — All Rights Reserved.
      </footer>
    </div>
  );
}
