"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "@phosphor-icons/react";
import type { Model } from "@/lib/models"; // type-only import, so no server code reaches the client
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCart } from "@/context/CartContext";

// Props defined here so we don't depend on the old ModelCardProps in @/types
type ProductPageProps = {
  model: Model;
  section?: "men" | "women" | "accessories";
};

// Every size we want to display, in display order.
// Spelling must match product_variants.size in Supabase exactly.
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Turns a "one point per line" string from the database into a clean array
const toLines = (text?: string | null) =>
  (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export default function ProductPage({
  model,
  section = "men",
}: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  // Exactly one size can be selected at a time (null = nothing selected yet)
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  /* ------------------------- data from Supabase ------------------------- */

  // Stock per size. A size can have several rows (one per color),
  // so we add their stock together.
  const stockBySize = new Map<string, number>();
  (model.variants ?? []).forEach((v) => {
    if (!v.size) return;
    stockBySize.set(v.size, (stockBySize.get(v.size) ?? 0) + (v.stock ?? 0));
  });

  // Total stock across all sizes (replaces the old model.stock)
  const totalStock = Array.from(stockBySize.values()).reduce(
    (sum, n) => sum + n,
    0,
  );
  const outOfStock = totalStock < 1;

  // The most the shopper can add:
  // the stock of the selected size, or the total if none is selected yet
  const maxQuantity = selectedSize
    ? (stockBySize.get(selectedSize) ?? 0)
    : totalStock;

  // Stock number shown in the indicator: the selected size's stock if one is picked
  const displayStock = selectedSize
    ? (stockBySize.get(selectedSize) ?? 0)
    : totalStock;

  const images = model.images ?? [];
  const categoryName = model.category?.name ?? "";
  const price = Number(model.price); // numeric columns can arrive as strings

  // fit_features and fabric_care are saved one point per line by the admin form
  const fitFeatures = toLines(model.fit_features);
  const fabricCare = toLines(model.fabric_care);

  /* -------------------------------- handlers -------------------------------- */

  // Select a size. Picking a different size replaces the current one;
  // clicking the selected size again unselects it.
  // Sizes with no stock can't be selected.
  const toggleSize = (size: string) => {
    if ((stockBySize.get(size) ?? 0) < 1) return;
    setSelectedSize((prev) => (prev === size ? null : size));
    setQuantity(1); // reset so quantity can't exceed the new size's stock
  };

  // Add the one selected size to the cart
  const handleAddToBag = () => {
    if (!selectedSize || outOfStock) return;
    const qty = Math.min(quantity, Math.max(1, maxQuantity));
    addToCart({
      id: model.id,
      name: model.name,
      price,
      image: images[0] ?? "",
      size: selectedSize,
      quantity: qty,
      section,
    });
  };

  /* ---------------------------------- view ---------------------------------- */

  return (
    <div className="bg-homepage-bg">
      {/* IMAGE AND ADD TO BAG */}
      <div className="flex gap-5 p-10 flex-col md:flex-row">
        {/* IMAGE */}
        <div className="md:w-1/2 px-5">
          {images.length > 0 ? (
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: true,
                skipSnaps: false,
                duration: 25,
              }}
            >
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`${model.name} ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            // Fallback when a product has no rows in products_images
            <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              No image
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="md:w-1/2 flex flex-col px-5 md:px-8 text-nav-bg">
          <h1 className="text-lg md:text-5xl font-chubbo font-bold">
            {model.name}
          </h1>
          {/* category is an object { id, name } now, not a string */}
          <h3 className="mt-4 text-3xl font-aime font-bold">{categoryName}</h3>
          <h3 className="mt-4 text-2xl">{`GH₵ ${price}`}</h3>

          {/* SIZES: all sizes are shown, styled by their state */}
          <div className="mt-4">
            <h3 className="font-recia font-regular">SELECT SIZE</h3>
            <div className="mt-2 flex gap-2 flex-wrap">
              {ALL_SIZES.map((item) => {
                // Does this product have this size in stock in Supabase?
                const isAvailable = (stockBySize.get(item) ?? 0) > 0;
                const isSelected = selectedSize === item;

                // Three looks: selected, available, unavailable
                const stateClass = isSelected
                  ? "bg-sky-600 text-white border-sky-600"
                  : isAvailable
                    ? "bg-gray-300"
                    : "bg-gray-100 text-gray-400 line-through opacity-60";

                return (
                  <Button
                    variant="outline"
                    key={item}
                    onClick={() => toggleSize(item)}
                    disabled={outOfStock || !isAvailable}
                    className={stateClass}
                  >
                    {item}
                  </Button>
                );
              })}
            </div>
            {!selectedSize && !outOfStock && (
              <p className="text-xs text-red-400 mt-1 font">
                Please select a size
              </p>
            )}
          </div>

          {/* STOCK INDICATOR */}
          <div className="mt-4">
            {displayStock > 0 ? (
              <p
                className={`text-sm font-medium ${
                  displayStock <= 5 ? "text-orange-500" : "text-green-600"
                }`}
              >
                {displayStock <= 5
                  ? `Only ${displayStock} left in stock`
                  : "In Stock"}
              </p>
            ) : (
              <p className="text-sm font-medium text-red-500">Out of Stock</p>
            )}
          </div>

          {/* QUANTITY SELECTOR */}
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">QUANTITY</h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-6 text-center">{quantity}</span>
              <button
                type="button"
                // can't go above the stock of the selected size
                onClick={() =>
                  setQuantity((q) => Math.min(Math.max(1, maxQuantity), q + 1))
                }
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* ADD TO BAG AND WISH LIST */}
          <div className="flex flex-col gap-2 mt-4 lg:mt-27">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                size="lg"
                className="bg-gray-900 w-full sm:flex-1 p-2 whitespace-nowrap text-sm sm:text-base"
                onClick={handleAddToBag}
                disabled={!selectedSize || outOfStock}
              >
                ADD TO BAG
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-gray-300 w-full sm:flex-1 p-2 whitespace-nowrap text-sm md:text-base"
              >
                <HeartIcon size={22} className="text-pink-500 mr-2 shrink-0" />
                ADD TO WISH LIST
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-5">
        {/* PRODUCT DESCRIPTION: three columns */}
        <div className="mt-8 md:mt-10 border-t pt-6 grid grid-cols-1 md:grid-cols-3">
          {/* Description: plain text */}
          <div className="py-4 first:pt-0 border-b md:border-b-0 md:border-r md:py-0 md:px-4 lg:px-6 md:first:pl-0">
            <h1 className="font-semibold mb-2 text-sm md:text-base">
              DESCRIPTION
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              {model.description}
            </p>
          </div>

          {/* Fit and features: one bullet per line from the admin form */}
          <div className="py-4 border-b md:border-b-0 md:border-r md:py-0 md:px-4 lg:px-6">
            <h1 className="font-semibold mb-2 text-sm md:text-base">
              FIT AND FEATURES
            </h1>
            <ul className="list-disc pl-5 text-gray-600 text-sm leading-relaxed">
              {fitFeatures.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          {/* Fabric and care: one bullet per line from the admin form */}
          <div className="py-4 last:pb-0 md:py-0 md:px-4 lg:px-6 md:last:pr-0">
            <h1 className="font-semibold mb-2 text-sm md:text-base">
              FABRIC AND CARE
            </h1>
            <ul className="list-disc pl-5 text-gray-600 text-sm leading-relaxed">
              {fabricCare.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* YOU MIGHT ALSO LIKE */}
        <div className="mt-8 md:mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            You Might Also Like
          </h2>
        </div>

        {/* REVIEWS */}
        <div className="mt-8 md:mt-10 border-t pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Customer Reviews
          </h2>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-yellow-400">★★★★☆</span>
            <span className="text-gray-500 text-sm">4.0 out of 5</span>
          </div>
          <p className="text-gray-500 text-sm">
            No reviews yet. Be the first to review this product.
          </p>
        </div>
      </div>
    </div>
  );
}