"use client";
import React, { useState } from "react";
import { LogIn, LogOut, FileText, CheckCircle } from "lucide-react";

interface AdminLoginProps {
  setIsAdminLoggedIn: (logged: boolean) => void;
  setView: (view: string) => void;
}

export function AdminLogin({ setIsAdminLoggedIn }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      sessionStorage.setItem("adminToken", "true");
      setIsAdminLoggedIn(true);
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-6 py-16">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <LogIn className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Admin Login
        </h2>
        <p className="text-gray-500 mb-6">Restricted access</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminPanel() {
  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Admin Dashboard</span>
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Welcome to the admin panel. Here you can review uploads and manage users (demo version).
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {["File Review", "Order Status"].map((item, i) => (
            <div
              key={i}
              className="p-6 border border-gray-200 rounded-xl shadow-sm bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-md transition"
            >
              <CheckCircle className="w-6 h-6 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {item}
              </h3>
              <p className="text-gray-500 text-sm">
                {item === "File Review"
                  ? "View and approve uploaded PCB designs."
                  : "Track order processing and shipping updates."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
