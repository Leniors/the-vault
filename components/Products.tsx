"use client";

import { useEffect, useState } from "react";
import { HoverEffect } from "./ui/card-hover-effect";
import { getProducts } from "@/lib/actions";

export default function Products() {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const visibleProducts = showAll ? products : products.slice(0, 9);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetched = await getProducts();
        if (Array.isArray(fetched)) {
          setProducts(fetched);
        } else {
          console.warn("getProducts() did not return an array");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-7 md:px-10 bg-black">
      

        {products.length > 0 ? (
          <>
          <div className="container mx-auto px-3 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white">
              Shop Our Merch
            </h2>
            <HoverEffect items={visibleProducts} />

            {products.length > 9 && (
              <div className="flex justify-end mt-4 px-2">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  {showAll ? "Show Less" : "View More"}
                </button>
              </div>
            )}
          </div>
          </>
        ) : (
          <p className="text-center text-neutral-400">No products available.</p>
        )}
    </section>
  );
}
