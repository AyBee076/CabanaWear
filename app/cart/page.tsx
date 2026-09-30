"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-xl text-gray-500">Your cart is empty</p>
        <Link href="/men">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 mt-[8ch]">
      <h1 className="text-3xl font-semibold mb-8">Order Summary</h1>

      <div className="flex flex-col lg:flex-row gap-8 font-fredoka">
        {/* Cart items */}
        <div className="flex-1 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex gap-4 bg-white rounded-lg shadow-sm p-4 border border-gray-100"
            >
              <div className="relative w-24 h-24 shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover rounded-md" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800">{item.name}</h2>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
                <p className="text-sm font-medium mt-1">GH₵ {item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >−</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >+</button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeFromCart(item.id, item.size)}>
                  <Trash size={18} className="text-gray-400 hover:text-red-500" />
                </button>
                <p className="font-semibold">GH₵ {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary panel */}
        <div className="lg:w-80 bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-fit sticky top-[10ch]">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Items ({totalItems})</span>
            <span>GH₵ {totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-gray-800">
            <span>Total</span>
            <span>GH₵ {totalPrice.toFixed(2)}</span>
          </div>
          <Button className="w-full mt-6 bg-gray-900">Proceed to Checkout</Button>
          <Button variant="outline" className="w-full mt-2" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}