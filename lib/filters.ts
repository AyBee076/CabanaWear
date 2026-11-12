// lib/filters.ts
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Section } from "@/types";

export async function getUniqueColors(section: Section): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_variants")
    .select("color, products!inner(section)")
    .eq("products.section", section)
    .eq("is_deleted", false);

  if (error) {
    console.error("Failed to load colors:", error.message);
    return [];
  }

  const colors = (data ?? [])
    .map((row) => row.color)
    .filter((c): c is string => Boolean(c));

  return [...new Set(colors)].sort();
}