import type { ModelDetailPageProps } from "@/types/index";
import { getModelById } from "@/lib/models";

import ProductPage from "@/components/ProductPage";

export default async function ModelDetailPage({
  params,
}: ModelDetailPageProps) {
  const { id } = await params;
  const model = await getModelById(id);
  console.log(model);
  return <ProductPage model={model} />;
}
