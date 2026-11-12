// app/women/(browse)/page.tsx
import ModelsGrid from "@/components/ModelGrid";
import { getModels } from "@/lib/models";
   import { parsePriceRange } from "@/lib/priceRanges";

type SearchParams = {
  query?: string;
  price?: string;
  colors?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { query, price, colors } = await searchParams;

  const models = await getModels("women", {
    query: query?.trim(),
    colors: colors
      ? colors.split(",").map((c) => c.trim()).filter(Boolean)
      : undefined,
    ...parsePriceRange(price),
  });

  return <ModelsGrid title="Women" models={models} section="women" />;
}