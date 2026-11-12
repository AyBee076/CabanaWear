// lib/priceRanges.ts  (plain file, no Supabase import)
// One list drives both the sidebar labels and the Supabase filter,
// so the two can never get out of sync.
import type { PriceRange } from "@/types";
import type { ModelFilters } from "@/lib/models";

type PriceFilter = Pick<
  ModelFilters,
  "minPrice" | "maxPrice" | "minExclusive" | "maxExclusive"
>;

// Edit this list to change your ranges. Keep them in order, with no gaps.
const RANGES: { label: string; filter: PriceFilter }[] = [
  { label: "Under GH₵100", filter: { maxPrice: 100, maxExclusive: true } },
  { label: "GH₵100 - GH₵200", filter: { minPrice: 100, maxPrice: 200 } },
  { label: "GH₵200 - GH₵300", filter: { minPrice: 200, maxPrice: 300 } },
  { label: "GH₵300 - GH₵400", filter: { minPrice: 300, maxPrice: 400 } },
  { label: "Over GH₵400", filter: { minPrice: 400, minExclusive: true } },
];

// For the sidebar
export function getPriceRanges(): PriceRange[] {
  return ["All", ...RANGES.map((r) => r.label)] as PriceRange[];
}

// For the page: turns the selected label into min/max values
export function parsePriceRange(price?: string): PriceFilter {
  return RANGES.find((r) => r.label === price)?.filter ?? {};
}