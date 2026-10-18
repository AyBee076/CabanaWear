import ModelCard from "@/components/ModelCard";
import type { Model } from "@/lib/models"; // the Supabase-based type

// Props defined here so we don't depend on the old ModelsGridProps in @/types
type ModelsGridProps = {
  title: string;
  models: Model[];
  section?: "men" | "women" | "accessories";
};

export default function ModelsGrid({
  title,
  models,
  section = "men",
}: ModelsGridProps) {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-5xl font-grotesque font-black">{title}</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} section={section} />
        ))}
      </div>
    </div>
  );
}