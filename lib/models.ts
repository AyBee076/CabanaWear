// import modelsData from "../data/models.json"
// import womenData from "../data/women.json"
// import accessoriesData from "../data/accessories.json"
// import type { Model, GetModelsParams } from "../types"

// const models = modelsData as unknown as Model[]
// const women = womenData as unknown as Model[]
// const accessories = accessoriesData as unknown as Model[]

// export async function getModels({ category }: GetModelsParams = {}): Promise<Model[]> {
//   let filteredModels = [...models]
//   if (category) {
//     filteredModels = models.filter((model) => model.category === category)
//   }
//   return filteredModels
// }

// export async function getWomenData({ category }: GetModelsParams = {}): Promise<Model[]> {
//   let filteredModels = [...women]
//   if (category) {
//     filteredModels = women.filter((model) => model.category === category)
//   }
//   return filteredModels
// }

// export async function getAccessoriesData({ category }: GetModelsParams = {}): Promise<Model[]> {
//   let filteredModels = [...accessories]
//   if (category) {
//     filteredModels = accessories.filter((model) => model.category === category)
//   }
//   return filteredModels
// }

// export async function getModelById(id: string | number): Promise<Model> {
//   const foundModel = models.find(
//     (model) => model.id.toString() === id.toString()
//   )
//   if (!foundModel) {
//     throw new Error(`Model with id ${id} not found`)
//   }
//   return foundModel
// }

// export async function getWomenDataById(id: string | number): Promise<Model> {
//   const foundModel = women.find(
//     (model) => model.id.toString() === id.toString()
//   )
//   if (!foundModel) {
//     throw new Error(`Model with id ${id} not found`)
//   }
//   return foundModel
// }

// export async function getAccessoriesDataId(id: string | number): Promise<Model> {
//   const foundModel = models.find(
//     (model) => model.id.toString() === id.toString()
//   )
//   if (!foundModel) {
//     throw new Error(`Model with id ${id} not found`)
//   }
//   return foundModel
// }

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
  fit_features: string | null;   // <-- add
  fabric_care: string | null;    // <-- add
  section: "men" | "women" | "accessories";
  created_at: string;
  products_images: ProductImageRow[] | null;
  product_variants: ProductVariant[] | null;
  categories: Category | null;
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

export async function getModels(section: "men" | "women"): Promise<Model[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(MODEL_SELECT)
    .eq("section", section)
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