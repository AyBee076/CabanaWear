import ModelsGrid from "@/components/ModelGrid";
import { getCategoryBySlug } from "@/lib/categories";
import { getModelsByCategory } from "@/lib/models";
import type { CategoryPageProps } from "@/types";

type SearchParams = {
  price?: string;
  colors?: string;
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps & { searchParams: Promise<SearchParams> }) {
  const { categoryName } = await params;
  const { price, colors } = await searchParams;

  const category = getCategoryBySlug(categoryName);
  const allModels = await getModelsByCategory(category.displayName, "women");

  const selectedColors = colors
    ? colors.split(",").map((c) => c.trim().toLowerCase())
    : [];

  const filtered = allModels.filter((model) => {
    if (price && price !== "All") {
      const p = Number(model.price);
      if (price === "Under $10" && p >= 10) return false;
      if (price === "$10 - $20" && (p < 10 || p > 20)) return false;
      if (price === "$20 - $40" && (p < 20 || p > 40)) return false;
      if (price === "Over $40" && p <= 40) return false;
    }

    if (selectedColors.length > 0) {
      const hasColor = model.variants.some(
        (v) => v.color && selectedColors.includes(v.color.toLowerCase())
      );
      if (!hasColor) return false;
    }

    return true;
  });

  return (
    <ModelsGrid
      title={category.displayName}
      models={filtered}
      section="accessories"
    />
  );
}