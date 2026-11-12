// app/accessories/layout.tsx
import React, { Suspense } from "react";
import Sidebar from "@/components/SideBar";
import SubNavigation from "@/components/SubNavigation";
import SearchBar from "@/components/SearchBar";
import { getCategories } from "@/lib/categories";
import { getUniqueColors } from "@/lib/filters";
import { getPriceRanges } from "@/lib/priceRanges";
import type { Section } from "@/types";

export default async function AccessoriesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const section: Section = "accessories";

  const [categories, colors] = await Promise.all([
    getCategories(section),
    getUniqueColors(section),
  ]);
  const priceRanges = getPriceRanges();

  return (
    <div className="relative flex flex-col min-h-screen md:flex-row bg-[#dfd7c9]">
      <Suspense fallback={<div>Loading filters...</div>}>
        <Sidebar section={section} priceRanges={priceRanges} colors={colors} />
      </Suspense>

      <main className="flex-1 p-4 md:ml-14 mt-2">
        <SubNavigation section={section} categories={categories} />
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
        {children}
      </main>
    </div>
  );
}