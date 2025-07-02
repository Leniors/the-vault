"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";

const LogoIcon = () => {
  const { user } = useUser();

  if (!user)
    return (
      <div className="fixed top-5 left-5 z-50 flex gap-4 items-center">
        <Link href="/auth/register" className="flex items-center justify-center">
          <img
            src="/thevaultlogo.png"
            alt="The Vault Logo"
            className="w-12 h-12 object-cover rounded-full shadow-lg"
          />
        </Link>
      </div>
    );

  return (
    <div className='fixed top-5 left-5 z-50 flex gap-4 items-center'>
        <Link href="/" className="flex items-center justify-center">
        <img
            src="/thevaultlogo.png"
            alt="The Vault Logo"
            className="w-10 h-10 object-cover rounded-full shadow-lg"
        />
        </Link>
    </div>
  );
};

export default LogoIcon;