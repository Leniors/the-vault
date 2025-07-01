"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { databases, account } from "@/lib/appwrite";
import { toast } from "sonner";
import { Card } from "@/components/ui/card-hover-effect";
import { Query } from "appwrite";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const usersCollectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
const ordersCollectionId =
  process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!;

export default function UserProfilePage() {
  const { userid } = useParams();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pastOrders, setPastOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      setLoading(true);
      if (!userid) {
        toast.error("User ID is required.");
        setLoading(false);
        return;
      }

      try {
        // 1. Query user document using userId
        const usersRes = await databases.listDocuments(
          databaseId,
          usersCollectionId,
          [Query.equal("userId", userid), Query.limit(1)]
        );

        const userDoc = usersRes.documents[0];
        if (!userDoc) {
          toast.error("User not found.");
          setLoading(false);
          return;
        }

        setUser(userDoc);

        // 2. Query orders using user email
        const ordersRes = await databases.listDocuments(
          databaseId,
          ordersCollectionId,
          [
            Query.equal("email", userDoc.email),
            Query.notEqual("status", "delivered"), // status ≠ delivered
            Query.orderDesc("$createdAt"),
          ]
        );

        const pastOrdersRes = await databases.listDocuments(
          databaseId,
          ordersCollectionId,
          [
            Query.equal("email", userDoc.email),
            Query.equal("status", "completed"),
            Query.orderDesc("$createdAt"),
          ]
        );

        setPastOrders(pastOrdersRes.documents);
        setOrders(ordersRes.documents);
      } catch (err) {
        console.error("Error fetching user/orders:", err);
        toast.error("Failed to load profile or orders.");
      } finally {
        setLoading(false);
      }
    };

    if (userid) fetchUserAndOrders();
  }, [userid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-9 md:gap-6 p-6 bg-black text-white">
      {/* Top nav */}
      <div className="md:col-span-1 mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
      </div>

      {/* Sidebar */}
      <div className="md:col-span-3">
        {/* user info */}
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>
        <p className="mb-8 text-neutral-400">Email: {user.email}</p>
      </div>

      {/* Orders */}
      <div className="md:col-span-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.$id} className="bg-zinc-900 p-4">
                  <p>
                    <span className="font-semibold">Order ID:</span> {order.$id}
                  </p>
                  <p>
                    <span className="font-semibold">Payment:</span>{" "}
                    {order.paymentType}
                  </p>
                  <p>
                    <span className="font-semibold">Total:</span> Ksh{" "}
                    {order.total}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {order.status}
                  </p>
                  <p>
                    <span className="font-semibold">Items:</span>{" "}
                    {Array.isArray(order.items)
                      ? order.items.map((item: any, i: number) => (
                          <span key={i} className="inline-block mr-2">
                            {item.name} × {item.quantity}
                          </span>
                        ))
                      : (() => {
                          try {
                            const parsed = JSON.parse(order.items);
                            return parsed.map((item: any, i: number) => (
                              <span key={i} className="inline-block mr-2">
                                {item.name} × {item.quantity}.
                              </span>
                            ));
                          } catch {
                            return (
                              <span className="text-red-400">
                                Invalid items
                              </span>
                            );
                          }
                        })()}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400">You have no orders yet.</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Orders</h2>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {pastOrders.map((order) => (
                <Card key={order.$id} className="bg-zinc-900 p-4">
                  <p>
                    <span className="font-semibold">Order ID:</span> {order.$id}
                  </p>
                  <p>
                    <span className="font-semibold">Payment:</span>{" "}
                    {order.paymentType}
                  </p>
                  <p>
                    <span className="font-semibold">Total:</span> Ksh{" "}
                    {order.total}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {order.status}
                  </p>
                  <p>
                    <span className="font-semibold">Items:</span>{" "}
                    {Array.isArray(order.items)
                      ? order.items.map((item: any, i: number) => (
                          <span key={i} className="inline-block mr-2">
                            {item.name} × {item.quantity}
                          </span>
                        ))
                      : (() => {
                          try {
                            const parsed = JSON.parse(order.items);
                            return parsed.map((item: any, i: number) => (
                              <span key={i} className="inline-block mr-2">
                                {item.name} × {item.quantity}.
                              </span>
                            ));
                          } catch {
                            return (
                              <span className="text-red-400">
                                Invalid items
                              </span>
                            );
                          }
                        })()}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400">You have no orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
