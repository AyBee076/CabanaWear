"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { Model } from "@/lib/models"; // type-only import, so no server code reaches the client

// Props defined here so we don't depend on the old ModelCardProps type,
// which described the old local data (model.size, model.stock, ...)
type ModelCardProps = {
  model: Model;
  section?: "men" | "women" | "accessories";
};

// Every size we want to display, in display order.
// Spelling must match product_variants.size in Supabase exactly.
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ModelCard({ model, section = "men" }: ModelCardProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const { addToCart } = useCart();

  /* ------------------------- data from Supabase ------------------------- */

  // Stock per size. A size can have several rows (one per color),
  // so we add their stock together.
  const stockBySize = new Map<string, number>();
  (model.variants ?? []).forEach((v) => {
    if (!v.size) return;
    stockBySize.set(v.size, (stockBySize.get(v.size) ?? 0) + (v.stock ?? 0));
  });

  // Total stock across all variants (replaces the old model.stock)
  const totalStock = Array.from(stockBySize.values()).reduce(
    (sum, n) => sum + n,
    0,
  );

  const outOfStock = totalStock < 1;

  // Images come from toModel(); guard against products with no photos
  const primaryImage = model.images?.[0];
  const secondaryImage = model.images?.[1] ?? primaryImage;

  // model.category is now an object { id, name } or null, not a string
  const categoryName = model.category?.name ?? "";

  // price may arrive as a string from Supabase "numeric" columns
  const price = Number(model.price);

  /* ---------------------------- scroll animation ---------------------------- */

  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Smooth out the raw scroll progress so it doesn't feel jittery
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });

  const y = useTransform(smoothProgress, [0, 0.5, 1], [80, 0, -80]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.92, 1, 0.92]);

  /* -------------------------------- handlers -------------------------------- */

  // Select or unselect a size. Sizes with no stock can't be selected.
  const toggleSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    if (outOfStock) return;
    if ((stockBySize.get(size) ?? 0) < 1) return;
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  // Add one cart item for every selected size
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock || selectedSizes.length === 0) return;
    selectedSizes.forEach((size) => {
      addToCart({
        id: model.id,
        name: model.name,
        price,
        image: primaryImage ?? "",
        size,
        quantity: 1,
        section,
      });
    });
  };

  /* ---------------------------------- view ---------------------------------- */

  return (
    <motion.div
      ref={cardRef}
      style={{ y, scale }}
      className={`block group transition-shadow ${
        outOfStock
          ? "opacity-90 cursor-not-allowed"
          : "hover:shadow-[0_5px_12px_rgba(0,0,0,0.1)]"
      }`}
      aria-labelledby={`model-${model.id}-title`}
    >
      <div
        className="overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition duration-300 ease-out"
        role="article"
      >
        {/* Image area: shows the second image on hover */}
        <div className="relative aspect-square overflow-hidden">
          <Link href={`/${section}/${model.id}`}>
            <div className="relative w-full h-full group/image">
              {primaryImage ? (
                <>
                  <Image
                    src={primaryImage}
                    alt={model.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover transition-opacity duration-300 opacity-100 group-hover/image:opacity-0 ${
                      outOfStock ? "grayscale" : ""
                    }`}
                  />
                  <Image
                    src={secondaryImage!}
                    alt={`${model.name} alternate view`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover transition-opacity duration-300 opacity-0 group-hover/image:opacity-100 ${
                      outOfStock ? "grayscale" : ""
                    }`}
                  />
                </>
              ) : (
                // Fallback when a product has no images in products_images
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
                  No image
                </div>
              )}
            </div>
          </Link>
        </div>

        <div className="p-4 font-fredoka flex flex-col ">
          {/* Category, name and price */}
          <div className="flex flex-col justify-between mb-2 min-h-[3.5rem]">
            <span className="text-sm text-left">{categoryName}</span>
            <h2
              id={`model-${model.id}-title`}
              className="text-xl font-semibold text-gray-800 line-clamp-2 text-left"
            >
              {model.name}
            </h2>
            <p className="text-gray-800 text-sm line-clamp-2 min-h-[2rem] leading-[1.25rem]">
              {`GH₵ ${price}`}
            </p>
          </div>

          {/* Stock message, based on the total stock of all variants */}
          {outOfStock ? (
            <span className="text-red-700 font-semibold">Out of Stock</span>
          ) : totalStock < 4 ? (
            <span className="text-yellow-700 font-semibold">
              {totalStock} left in stock
            </span>
          ) : (
            <span className="text-green-700 font-semibold">In Stock!</span>
          )}

          {/* Size buttons: all sizes are shown, styled by their state */}
          <div className="mt-2 flex flex-wrap gap-2">
            {ALL_SIZES.map((size) => {
              // Does this product have this size in stock in Supabase?
              const isAvailable = (stockBySize.get(size) ?? 0) > 0;
              // Has the shopper picked this size?
              const isSelected = selectedSizes.includes(size);

              // Three looks:
              // 1. selected    -> your selected style
              // 2. available   -> your normal style
              // 3. unavailable -> faded and crossed out
              const stateClass = isSelected
                ? "bg-card-size-btn text-white"
                : isAvailable
                  ? "bg-card-btn text-card-size-text"
                  : "bg-gray-100 text-gray-400 line-through opacity-60";

              return (
                <Button
                  variant="outline"
                  key={size}
                  onClick={(e: React.MouseEvent) => toggleSize(e, size)}
                  disabled={outOfStock || !isAvailable}
                  className={stateClass}
                >
                  {size}
                </Button>
              );
            })}
          </div>

          {/* Add to cart: adds every selected size */}
          <div className="mt-5">
            <Button
              className="w-full bg-card-btn"
              onClick={handleAddToCart}
              disabled={outOfStock || selectedSizes.length === 0}
            >
              Add to Cart <ShoppingCartIcon size={32} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}