"use client";
import React, { useState, useEffect } from "react";
import { AdminLogin, AdminPanel } from "@/components/admin"; // we'll extract them too

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) setIsAdminLoggedIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {isAdminLoggedIn ? (
        <AdminPanel />
      ) : (
        <AdminLogin
          setIsAdminLoggedIn={setIsAdminLoggedIn}
          setView={() => {}}
        />
      )}
    </div>
  );
}
