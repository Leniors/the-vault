"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account, databases, ID, storage, teams } from "@/lib/appwrite";
import { getUserById } from "@/lib/actions";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card-hover-effect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductEditModal from "@/components/ProductEditModal";
import { Query } from "appwrite";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import AddProductForm from "@/components/AddProductForm";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PRODUCTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const ORDERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // product being edited
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProducts = async () => {
    const res = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID
    );
    setProducts(res.documents);
  };

  const fetchOrders = async () => {
    const res = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.notEqual("status", "completed")]
    );
    setOrders(res.documents);
  };

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const authUser = await account.get();
        const memberships = await teams.listMemberships("68612e100010d07685c5");
        const isInTeam = memberships.memberships.some(
          (m) => m.userId === authUser.$id
        );
        const user = await getUserById(authUser.$id);
        const isAdmin = isInTeam && user?.role === "admin";

        if (!isAdmin) {
          router.push("/");
        } else {
          setLoading(false);
        }
      } catch (error) {
        router.push("/auth/login");
      }
    };

    checkAdminAccess();
    fetchOrders();
    fetchProducts();
  }, []);

  // Delete
  const onDeleteProduct = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // Edit (you can show a modal form)
  const onEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const markAsCompleted = async (orderId: string) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        orderId,
        {
          status: "completed",
        }
      );
      toast.success("Order marked as completed");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <Loader className="w-6 h-6 animate-spin" />
        Verifying admin access...
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-6 md:max-h-screen md:mb-0 md:flex-row gap-8 md:p-10 p-4 text-white w-full">
      {/* Left: Add Product Form */}
      <div className="md:w-1/3">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <AddProductForm onProductAdded={(newList) => setProducts(newList)} />
      </div>

      {/* Middle: Orders */}
      <div className="md:w-1/3">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <div className="md:max-h-[700px] md:pb-4 md:overflow-y-auto scrollbar-hide md:px-2">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                let parsedItems: any[] = [];

                try {
                  parsedItems = JSON.parse(order.items || "[]");
                } catch (err) {
                  console.error("Invalid items JSON in order", order.$id);
                }

                return (
                  <Card key={order.$id} className="bg-zinc-900 p-4">
                    <p>
                      <span className="font-semibold">Customer:</span>{" "}
                      {order.name || "Unknown"}
                    </p>
                    <p>
                      <span className="font-semibold">Items:</span>{" "}
                      {parsedItems.length}
                    </p>
                    <ul className="list-disc list-inside text-sm text-neutral-300">
                      {parsedItems.map((item, index) => (
                        <li key={index}>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2">
                      <span className="font-semibold">Total:</span> Ksh{" "}
                      {order.total}
                    </p>
                    <button
                      onClick={() => markAsCompleted(order.$id)}
                      disabled={order.status === "completed"}
                      className={`absolute right-1 bottom-1 mt-3 px-3 py-1 rounded text-sm font-medium ${
                        order.status === "completed"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-green-600 cursor-pointer"
                      }`}
                    >
                      {order.status === "completed"
                        ? "Completed"
                        : "Mark as Completed"}
                    </button>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-neutral-400">No orders available.</p>
          )}
        </div>
      </div>

      {/* Right: Products */}
      <div className="md:w-1/3">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="md:max-h-[700px] md:pb-4 md:overflow-y-auto scrollbar-hide md:px-2">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <Card key={product.$id}>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full object-cover rounded"
                    />
                  )}
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>Ksh {product.price}</CardDescription>
                  <div className="absolute bottom-1 right-1 group-hover:opacity-100 flex gap-2">
                    {showEditModal && editingProduct && (
                      <ProductEditModal
                        product={editingProduct}
                        onClose={() => setShowEditModal(false)}
                        onSave={fetchProducts}
                      />
                    )}

                    <button
                      onClick={() => onEditProduct(product)}
                      className="bg-blue-600 px-2 text-sm rounded text-white"
                    >
                      Edit
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="bg-red-600 px-2 text-sm rounded text-white"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the product from your store.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteProduct(product.$id)}
                            className="bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Yes, delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400">No products available.</p>
          )}
        </div>
      </div>
      <div className="fixed z-50 bottom-4 left-4">
        <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            <Link href="/" className="text-white">
              Back to Home
            </Link>
          </span>
        </button>
      </div>
    </div>
  );
}
