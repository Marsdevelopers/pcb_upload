// src/app/layout.tsx
import React from 'react';
import './globals.css'; // if you have global styles

export const metadata = {
  title: 'PCB Upload Portal',
  description: 'Upload Gerber files and manage PCB print requests',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
