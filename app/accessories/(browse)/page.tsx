import ModelsGrid from "@/components/ModelGrid";
import { getModels } from "@/lib/models";

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

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const selectedColors = colors
    ? colors.split(",").map((c) => c.trim().toLowerCase())
    : [];

  const allModels = await getModels("accessories");

  const filtered = allModels.filter((model) => {
    // Search filter
    if (normalizedQuery) {
      const matchesName = model.name.toLowerCase().includes(normalizedQuery);
      const matchesDescription = (model.description ?? "")
        .toLowerCase()
        .includes(normalizedQuery);
      if (!matchesName && !matchesDescription) return false;
    }

    // Price filter
    if (price && price !== "All") {
      const p = Number(model.price);
      if (price === "Under $10" && p >= 10) return false;
      if (price === "$10 - $20" && (p < 10 || p > 20)) return false;
      if (price === "$20 - $40" && (p < 20 || p > 40)) return false;
      if (price === "Over $40" && p <= 40) return false;
    }

    // Color filter
    if (selectedColors.length > 0) {
      const hasColor = model.variants.some(
        (v) => v.color && selectedColors.includes(v.color.toLowerCase())
      );
      if (!hasColor) return false;
    }

    return true;
  });

  return <ModelsGrid title="Accessories" models={filtered} section="accessories" />;
}