"use client";

import Link from "next/link";
import { HeartIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ModelCardProps } from "@/types";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function ModelCard({ model, section = "men" }: ModelCardProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const { addToCart } = useCart();

  const outOfStock = model.stock < 1;

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
  // const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const toggleSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    if (outOfStock) return;
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock || selectedSizes.length === 0) return;
    selectedSizes.forEach((size) => {
      addToCart({
        id: model.id,
        name: model.name,
        price: model.price,
        image: model.images[0],
        size,
        quantity: 1,
        section,
      });
    });
  };

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
        <div className="relative aspect-square overflow-hidden">
          <Link href={`/${section}/${model.id}`}>
            <div className="relative w-full h-full group/image">
              <Image
                src={model.images[0]}
                alt={model.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-opacity duration-300 opacity-100 group-hover/image:opacity-0 ${
                  outOfStock ? "grayscale" : ""
                }`}
              />
              <Image
                src={model.images[1] ?? model.images[0]}
                alt={`${model.name} alternate view`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-opacity duration-300 opacity-0 group-hover/image:opacity-100 ${
                  outOfStock ? "grayscale" : ""
                }`}
              />
            </div>
          </Link>
        </div>
        <div className="p-4 font-fredoka flex flex-col ">
          <div className="flex flex-col justify-between mb-2 min-h-[3.5rem]">
            <span id={`model-${model.id}-title`} className="text-sm text-left">
              {model.category}
            </span>
            <h2
              id={`model-${model.id}-title`}
              className="text-xl font-semibold text-gray-800 line-clamp-2 text-left"
            >
              {model.name}
            </h2>
            <p className="text-gray-800 text-sm line-clamp-2 min-h-[2rem] leading-[1.25rem]">
              {`GH₵ ${model.price}`}
            </p>
          </div>

          {outOfStock ? (
            <span className="text-red-700 font-semibold">Out of Stock</span>
          ) : model.stock < 4 ? (
            <span className="text-yellow-700 font-semibold">
              3 left in stock
            </span>
          ) : (
            <span className="text-green-700 font-semibold">In Stock!</span>
          )}

          <div
            className="flex items-center mt-2 text-gray-600"
            aria-label={`${model.likes} likes`}
          >
            <HeartIcon
              className="w-5 h-5 mr-1 text-gray-400"
              aria-hidden="true"
            />
            <span>{model.likes}</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {model.size.map((item) => (
              <Button
                variant="outline"
                key={item}
                onClick={(e: React.MouseEvent) => toggleSize(e, item)}
                disabled={outOfStock}
                className={
                  selectedSizes.includes(item)
                    ? "bg-card-size-btn text-white"
                    : "bg-card-btn text-card-size-text "
                }
              >
                {item}
              </Button>
            ))}
          </div>

          <div className="mt-5">
            <Button
              className="w-full bg-card-btn"
              onClick={handleAddToCart}
              disabled={outOfStock}
            >
              Add to Cart <ShoppingCartIcon size={32} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
