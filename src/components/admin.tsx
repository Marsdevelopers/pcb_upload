"use client";
import React, { useEffect, useState } from "react";

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("adminToken", data.token);
    } else {
      alert(data.error || "Login failed");
    }
  };

  const fetchSubmissions = async () => {
    const storedToken = localStorage.getItem("adminToken");
    if (!storedToken) return;

    setLoading(true);
    const res = await fetch("/api/submissions", {
      headers: { Authorization: `Bearer ${storedToken}` },
    });

    const data = await res.json();
    setLoading(false);

    if (data.submissions) setSubmissions(data.submissions);
    else alert(data.error || "Failed to fetch submissions");
  };

  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      setToken(localStorage.getItem("adminToken")!);
      fetchSubmissions();
    }
  }, []);

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="p-6 bg-white rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border w-full px-3 py-2 rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">📂 PCB Submissions</h1>
      <button
        onClick={fetchSubmissions}
        className="bg-blue-500 text-white px-3 py-2 rounded-md mb-4"
      >
        Refresh
      </button>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {submissions.map((s) => (
          <div key={s.id} className="p-4 bg-white shadow rounded-lg">
            <h3 className="font-semibold">{s.name}</h3>
            <p>Email: {s.email}</p>
            <p>Phone: {s.phone}</p>
            <p>Notes: {s.notes || "None"}</p>
            <a
              href={s.file_url}
              target="_blank"
              className="text-blue-500 underline"
            >
              View File
            </a>
            <p className="text-sm text-gray-500">
              {new Date(s.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
