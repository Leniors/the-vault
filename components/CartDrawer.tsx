"use client";

import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { isOpen, closeCart, items, total, decrementItem, incrementItem } =
    useCart();
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-60"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="relative w-[90%] max-w-md md:max-w-sm h-full bg-black text-white p-6 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button onClick={closeCart} className="hover:text-neutral-400">
                <FaTimes />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {items.length === 0 ? (
                <p className="text-sm text-neutral-500">Your cart is empty.</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-neutral-900 rounded p-3"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-neutral-400">
                          {item.quantity} × KSh {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => incrementItem(item.id)}
                        className="text-lg font-bold px-2 rounded hover:bg-neutral-800 transition"
                      >
                        +
                      </button>
                      <button
                        onClick={() => decrementItem(item.id)}
                        className="text-lg font-bold px-2 rounded hover:bg-neutral-800 transition"
                      >
                        −
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-neutral-700 mt-4">
              <div className="flex justify-between mb-4 text-lg">
                <span className="font-medium text-neutral-300">Total:</span>
                <span className="font-bold">KSh {total.toLocaleString()}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeCart}
                  className="flex-1 py-2 border border-neutral-600 rounded text-sm hover:bg-neutral-800 transition"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    closeCart();
                    router.push("/checkout");
                  }}
                  className="flex-1 py-2 bg-white text-black rounded text-sm hover:opacity-90 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
