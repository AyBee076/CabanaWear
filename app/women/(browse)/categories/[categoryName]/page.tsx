// app/women/(browse)/categories/[categoryName]/page.tsx
import { notFound } from "next/navigation";
import ModelsGrid from "@/components/ModelGrid";
import { getCategoryBySlug } from "@/lib/categories";
import { getModels } from "@/lib/models";
   import { parsePriceRange } from "@/lib/priceRanges";
import type { Section } from "@/types";

const SECTION: Section = "women";

type SearchParams = {
  query?: string;
  price?: string;
  colors?: string;
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryName: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { categoryName } = await params; // this is the slug from the URL
  const { query, price, colors } = await searchParams;

  const category = await getCategoryBySlug(categoryName, SECTION);
  if (!category) notFound();

  const models = await getModels(SECTION, {
    category: category.displayName,
    query: query?.trim(),
    colors: colors
      ? colors.split(",").map((c) => c.trim()).filter(Boolean)
      : undefined,
    ...parsePriceRange(price),
  });

  return (
    <ModelsGrid
      title={category.displayName}
      models={models}
      section={SECTION}
    />
  );
}