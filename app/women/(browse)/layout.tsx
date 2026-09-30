import React from "react";
import { Suspense } from "react";
import Sidebar from "../../../components/SideBar";
import SubNavigation from "@/components/SubNavigation";
import SearchBar from "@/components/SearchBar";

export default function ModelsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex flex-col min-h-screen md:flex-row bg-[#dfd7c9]">
      <Suspense fallback={<div>Loading filters...</div>}>
        <Sidebar />
      </Suspense>
       <main className="flex-1 p-4 md:ml-14 mt-2 ">
              <SubNavigation />
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
      
              {/* <SearchBar /> */}
              {children}
            </main>
    </div>
  );
}
