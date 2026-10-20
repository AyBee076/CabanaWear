"use client";

import Image from "next/image";
import { TrashIcon, MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useCart } from "../app/Context/CartContext";
import type { CartItem as CartItemType } from "../app/Context/CartReducer";

export default function CartItem({ item }: { item: CartItemType }) {
  const { dispatch } = useCart();

  return (
    <div className="rounded-3xl border border-neutral-300 xl:w-11/12">
      <div className="flex flex-col gap-6 border-b border-neutral-300 px-4 py-6 sm:flex-row sm:items-center">
        <div className="relative mx-auto w-36 h-36 rounded-2xl bg-gray-300 p-4 sm:mx-0 sm:w-32 sm:h-32">
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 144px, 128px"
            className="object-cover rounded-2xl"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold xl:text-2xl">{item.name}</h1>
            <TrashIcon
              size={24}
              className="cursor-pointer text-red-600"
              onClick={() =>
                dispatch({ type: "REMOVE_FROM_CART", payload: item.id })
              }
            />
          </div>

          <div className="flex gap-3 text-sm">
            <span className="font-semibold">Size:</span>
            <span className="text-gray-600">{item.size}</span>
          </div>

          <div className="flex gap-3 text-sm">
            <span className="font-semibold">Color:</span>
            <span className="text-gray-600">{item.color}</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-2xl font-semibold xl:text-3xl">
              ${item.price}
            </h1>
            <div className="flex h-11 items-center gap-4 rounded-3xl bg-gray-50 px-4">
              <MinusIcon
                size={20}
                className="cursor-pointer"
                onClick={() =>
                  dispatch({ type: "DECREMENT", payload: item.id })
                }
              />
              <span className="text-xl">{item.quantity}</span>
              <PlusIcon
                size={20}
                className="cursor-pointer"
                onClick={() =>
                  dispatch({ type: "INCREMENT", payload: item.id })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
