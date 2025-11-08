"use client";
import React, { useEffect, useState } from "react";

export function AdminPanel() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/submissions")
      .then(res => res.json())
      .then(data => setSubmissions(data.submissions || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">PCB Submissions</h2>
      {submissions.map(sub => (
        <div key={sub.id} className="border p-4 mb-3 rounded">
          <p><strong>Name:</strong> {sub.name}</p>
          <p><strong>Email:</strong> {sub.email}</p>
          <p><strong>Phone:</strong> {sub.phone}</p>
          <p><strong>Notes:</strong> {sub.notes}</p>
          <p><strong>File:</strong> <a href={sub.file_url} target="_blank">{sub.file_name}</a></p>
        </div>
      ))}
    </div>
  );
}
