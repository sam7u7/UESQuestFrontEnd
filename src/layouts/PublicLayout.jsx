import React from 'react';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <main className="w-full max-w-md p-6">
        {children}
      </main>
    </div>
  );
}