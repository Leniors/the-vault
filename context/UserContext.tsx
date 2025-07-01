"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { getUserById } from "@/lib/actions";

type User = {
  $id: string;
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string;
  role: string;
  email?: string;
} | null;

type UserContextType = {
  user: User;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logoutUser: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      await new Promise((res) => setTimeout(res, 300)); // small delay helps in local dev
      const authUser = await account.get();
      const dbUser = await getUserById(authUser.$id);

      if (dbUser) {
        const mappedUser: User = {
          $id: authUser.$id,
          userId: dbUser.userId,
          name: dbUser.name,
          username: dbUser.username,
          avatarUrl: dbUser.avatarUrl,
          role: dbUser.role,
          email: dbUser.email,
        };
        setUser(mappedUser);
        localStorage.setItem("the-vault-user", JSON.stringify(mappedUser));
      } else {
        setUser(null);
        localStorage.removeItem("the-vault-user");
      }
    } catch {
      setUser(null);
      localStorage.removeItem("the-vault-user");
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await account.deleteSession("current");
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("the-vault-user");
      // Optionally reload or redirect
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem("the-vault-user");
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        localStorage.removeItem("the-vault-user");
      }
    }
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
