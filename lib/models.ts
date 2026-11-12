// lib/models.ts
import "server-only";
import { createClient } from "@/lib/supabase/server";

type ProductImageRow = {
  image_url: string | null;
  image_type: string | null;
  is_primary: boolean | null;
  display_order: number | null;
};

type Category = { id: string; name: string };

type ProductVariant = {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  stock: number | null;
};

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  fit_features: string | null;
  fabric_care: string | null;
  section: "men" | "women" | "accessories";
  created_at: string;
  products_images: ProductImageRow[] | null;
  product_variants: ProductVariant[] | null;
  categories: Category | null;
};

export type ModelFilters = {
  category?: string; // category NAME, e.g. "Zipped Shirts"
  query?: string;
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  minExclusive?: boolean;
  maxExclusive?: boolean;
};

export type Model = Omit<
  ProductRow,
  "products_images" | "product_variants" | "categories"
> & {
  images: string[];
  variants: ProductVariant[];
  category: Category | null;
};

const MODEL_SELECT = `
  *,
  categories ( id, name ),
  product_variants ( * ),
  products_images ( image_url, image_type, is_primary, display_order )
`;

function toModel(row: ProductRow): Model {
  const { products_images, product_variants, categories, ...product } = row;

  const images = [...(products_images ?? [])]
    .sort((a, b) => {
      const orderDiff = (a.display_order ?? 999) - (b.display_order ?? 999);
      if (orderDiff !== 0) return orderDiff;
      return Number(b.is_primary ?? false) - Number(a.is_primary ?? false);
    })
    .map((img) => img.image_url)
    .filter((url): url is string => Boolean(url));

  return {
    ...product,
    images,
    variants: product_variants ?? [],
    category: categories ?? null,
  };
}

export async function getModels(
  section: "men" | "women" | "accessories",
  filters: ModelFilters = {}
): Promise<Model[]> {
  const supabase = await createClient();
  const {
    category,
    query,
    colors,
    minPrice,
    maxPrice,
    minExclusive,
    maxExclusive,
  } = filters;

  const filterByColor = !!colors && colors.length > 0;

  // "!inner" keeps only rows that have a match; without a filter we use a
  // normal join so products with no variants/category still show.
  const categoriesJoin = category ? "categories!inner" : "categories";
  const variantsJoin = filterByColor ? "product_variants!inner" : "product_variants";

  let request = supabase
    .from("products")
    .select(
      `
      *,
      ${categoriesJoin} ( id, name ),
      ${variantsJoin} ( * ),
      products_images ( image_url, image_type, is_primary, display_order )
    `
    )
    .eq("section", section);

  if (category) request = request.eq("categories.name", category);

  if (query) {
    // strip characters that would break the PostgREST or() syntax
    const safe = query.replace(/[,()%*]/g, " ").trim();
    if (safe) {
      request = request.or(`name.ilike.%${safe}%,description.ilike.%${safe}%`);
    }
  }

  if (minPrice !== undefined) {
    request = minExclusive
      ? request.gt("price", minPrice)
      : request.gte("price", minPrice);
  }
  if (maxPrice !== undefined) {
    request = maxExclusive
      ? request.lt("price", maxPrice)
      : request.lte("price", maxPrice);
  }

  if (filterByColor) request = request.in("product_variants.color", colors);

  const { data, error } = await request
    .order("created_at", { ascending: false })
    .returns<ProductRow[]>();

  if (error) {
    console.error("Failed to fetch products:", error.message);
    return [];
  }

  return (data ?? []).map(toModel);
}

export async function getModelById(id: string | number): Promise<Model> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(MODEL_SELECT)
    .eq("id", id)
    .maybeSingle<ProductRow>();

  if (error) {
    throw new Error(`Failed to fetch model ${id}: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Model with id ${id} not found`);
  }

  return toModel(data);
}