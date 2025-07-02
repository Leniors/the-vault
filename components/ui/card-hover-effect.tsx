"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

type Product = {
  $id: string;
  name: string;
  price: number;
  image: string;
  stock?: number;
};

export const HoverEffect = ({
  items,
  className,
}: {
  items: Product[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { addToCart } = useCart();
  const router = useRouter();

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10 bg-black",
        className
      )}
    >
      {items.map((item, idx) => {
        const id = item.$id; // Use link as unique ID

        return (
          <div
            key={id}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-white/10 dark:bg-white/5 block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>

            <Card>
              <img
                src={item.image}
                alt={item.name}
                className="w-full object-cover rounded"
              />
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.price}</CardDescription>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => addToCart({ ...item, id, quantity: 1 })}
                  className="bg-white text-black text-md font-semibold px-3 py-1 mt-2 rounded hover:bg-gray-200 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => router.push(`/checkout/${item.$id}`)}
                  disabled={item.stock === 0}
                  className={`bg-blue-600 text-white text-md py-1 px-3 rounded mt-2 ${
                    item.stock === 0 ? "bg-gray-600 cursor-not-allowed" : ""
                  }`}
                >
                  {item.stock === 0 ? "Out of Stock" : "Buy Now"}
                </button>
                {item.stock !== undefined && item.stock > 5 && (
                  <div className="absolute top-[0.5px] right-[0.5px] bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                    In stock
                  </div>
                )}
                {item.stock !== undefined &&
                  item.stock < 5 &&
                  item.stock > 0 && (
                    <div className="absolute top-[0.5px] right-[0.5px] bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                      Low stock
                    </div>
                  )}
                {item.stock === 0 && (
                  <div className="absolute top-[0.5px] right-[0.5px] bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                    Out of stock
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-neutral-900 border border-white/10 group-hover:border-white/30 transition-all duration-200 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-white font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-2 text-zinc-400 font-medium tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
