// lib/categories.ts
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { Category, Section } from "@/types";

export async function getCategories(section: Section): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, products!inner(section)")
    .eq("products.section", section);

  if (error) {
    console.error("Failed to load categories:", error.message);
    return [];
  }

  // a category appears once per product, so remove duplicates
  const unique = new Map<string, string>();
  for (const row of data ?? []) unique.set(row.id, row.name);

  return [...unique.values()]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ slug: slugify(name), displayName: name }));
}

// Returns undefined when the slug doesn't match any category in that section
export async function getCategoryBySlug(
  slug: string,
  section: Section
): Promise<Category | undefined> {
  const categories = await getCategories(section);
  return categories.find((c) => c.slug === slug);
}

export async function getDisplayNameFromSlug(
  slug: string,
  section: Section
): Promise<string | undefined> {
  const category = await getCategoryBySlug(slug, section);
  return category?.displayName;
}