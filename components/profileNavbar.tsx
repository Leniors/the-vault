"use client";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const UserNavButtons = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex gap-4 items-center">
      {user.role === "admin" && (
        <Link href="/admin" className="bg-red-600 px-3 py-1 rounded">
          Admin Dashboard
        </Link>
      )}
      <Link href={`/profile/${user.$id}`} className="bg-blue-600 px-3 py-1 rounded">
        My Profile
      </Link>
    </div>
  );
};

export default UserNavButtons;
