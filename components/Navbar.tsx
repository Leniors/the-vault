"use client";

import { FaShoppingBag } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import UserNavButtons from "./profileNavbar";

const Navbar = () => {
  const { toggleCart, items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed top-5 right-5 z-50 flex gap-4 items-center">
      <UserNavButtons />
      <button
        onClick={toggleCart}
        className="relative p-3 bg-white/10 backdrop-blur-md rounded-full shadow hover:scale-105 transition"
      >
        <FaShoppingBag className="text-white w-5 h-5" />

        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default Navbar;
