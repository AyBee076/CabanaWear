import ModelsGrid from "../../../components/ModelGrid";
import { getModels } from "@/lib/models";


type SearchParams = {
  query?: string;
  price?: string;
  colors?: string;
};

export default async function page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { query, price, colors } = await searchParams;
  const selectedColors = colors
    ? colors.split(",").map((c) => c.trim().toLowerCase())
    : []
  const normalizedQuery = query?.toLowerCase() || "";
  const allModels = await getModels("women");

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
      if (price === "Under $10" && model.price >= 10) return false;
      if (price === "$10 - $20" && (model.price < 10 || model.price > 20))
        return false;
      if (price === "$20 - $40" && (model.price < 20 || model.price > 40))
        return false;
      if (price === "Over $40" && model.price <= 40) return false;
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

  return (
    <>
      <ModelsGrid title="Women" models={filtered} section="women" />
    </>
  );
}
