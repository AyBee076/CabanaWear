"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PriceRange, Section } from "@/types";

interface SidebarProps {
  section: Section;
  priceRanges: PriceRange[];
  colors: string[];
}

export default function Sidebar({ priceRanges, colors }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState<PriceRange>("All");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);


  const handlePrice = (range: PriceRange) => {
    setPrice(range);
    const params = new URLSearchParams(searchParams.toString());
    if (range === "All") params.delete("price");
    else params.set("price", range);
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleColor = (color: string) => {
    const updated = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    setSelectedColors(updated);
    const params = new URLSearchParams(searchParams.toString());
    if (updated.length === 0) params.delete("colors");
    else params.set("colors", updated.join(","));
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeFilterCount =
    (price !== "All" ? 1 : 0) + selectedColors.length;

  return (
    <>
      {/* Toggle button - shows on mobile AND tablet */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-24 left-4 z-40 flex items-center gap-2 rounded-full bg-[#fdf0d5] border border-black/10 pl-3 pr-4 py-2.5 text-sm font-medium text-stone-800 shadow-md hover:shadow-lg hover:bg-[#fbe6bd] active:scale-95 transition-all"
        aria-label="Open filters"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="11" cy="18" r="2" fill="currentColor" stroke="none" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stone-800 text-white text-xs leading-none">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity duration-300"
        />
      )}

      <aside
        className={`
          w-64 lg:w-52 shrink-0 flex flex-col gap-8 p-6
          bg-[#fdf0d5] lg:bg-[#fdf0d5]
          border-r border-black/5
          fixed lg:static top-0 left-0 h-full lg:h-auto z-50
          shadow-2xl lg:shadow-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Header row - mobile/tablet only */}
        <div className="lg:hidden flex items-center justify-between pb-4 border-b border-black/10">
          <h2 className="text-base font-semibold tracking-tight text-stone-900">
            Filters
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
            className="w-8 h-8 flex items-center justify-center rounded-full text-stone-600 hover:bg-black/5 hover:text-stone-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Price */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
            Price
          </h3>
          <div className="flex flex-col">
            {priceRanges.map((range) => (
              <label
                key={range}
                className={`
                  flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-md cursor-pointer text-sm
                  transition-colors
                  ${price === range ? "bg-black/5 text-stone-900 font-medium" : "text-stone-700 hover:bg-black/[0.03]"}
                `}
              >
                <input
                  type="radio"
                  name="price"
                  checked={price === range}
                  onChange={() => handlePrice(range)}
                  className="w-3.5 h-3.5 accent-stone-800 cursor-pointer"
                />
                {range}
              </label>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
            Colors
          </h3>
          <div className="flex flex-col">
            {colors.map((color) => {
              const checked = selectedColors.includes(color);
              return (
                <label
                  key={color}
                  className={`
                    flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-md cursor-pointer text-sm
                    transition-colors
                    ${checked ? "bg-black/5 text-stone-900 font-medium" : "text-stone-700 hover:bg-black/[0.03]"}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleColor(color)}
                    className="w-3.5 h-3.5 accent-stone-800 rounded cursor-pointer"
                  />
                  {color}
                </label>
              );
            })}
          </div>
        </div>

        {/* Clear filters - only shows when something is active */}
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              setPrice("All");
              setSelectedColors([]);
              router.push(pathname);
            }}
            className="mt-auto text-xs font-medium text-stone-500 hover:text-stone-900 underline underline-offset-2 transition-colors self-start"
          >
            Clear all filters
          </button>
        )}
      </aside>
    </>
  );
}