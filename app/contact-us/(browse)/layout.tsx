import React from "react";

export default function ModelsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <div className="relative flex flex-col min-h-screen md:flex-row bg-[#fdf0d5]">
      
      {/* Main Content Area */}
      <main className="flex-1 p-4 md:ml-64">{children}</main>
    </div>
  );
}
