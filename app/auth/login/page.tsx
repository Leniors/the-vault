"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account, databases, storage, teams, ID } from "@/lib/appwrite";
import { getUserById } from "@/lib/actions";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card-hover-effect";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PRODUCTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const ORDERS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.string().min(1, "Price is required"),
  image: z.any().refine((file) => file?.[0], "Image is required"),
});

type ProductForm = z.infer<typeof ProductSchema>;

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const form = useForm<ProductForm>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      price: "",
      image: undefined,
    },
  });

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
          const [productList, orderList] = await Promise.all([
            databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION),
            databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION),
          ]);
          setProducts(productList.documents);
          setOrders(orderList.documents);
          setLoading(false);
        }
      } catch (error) {
        router.push("/auth/login");
      }
    };

    checkAdminAccess();
  }, []);

  const onSubmit = async (values: ProductForm) => {
    try {
      const file = values.image[0];
      const fileId = ID.unique();

      // Upload image to Appwrite Storage
      const uploaded = await storage.createFile(BUCKET_ID, fileId, file);
      const imageUrl = storage.getFileView(BUCKET_ID, uploaded.$id);

      // Create product document
      await databases.createDocument(DATABASE_ID, PRODUCTS_COLLECTION, ID.unique(), {
        name: values.name,
        price: parseFloat(values.price),
        image: imageUrl,
      });

      toast.success("Product added successfully");
      form.reset();

      const productList = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION);
      setProducts(productList.documents);
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <Loader className="w-6 h-6 animate-spin mr-2" />
        Verifying admin access...
      </div>
    );
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add Product Form */}
      <div className="mb-10 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-zinc-800 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (Ksh)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-zinc-800 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Add Product</Button>
          </form>
        </Form>
      </div>

      {/* Products List */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </Card>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.$id} className="bg-zinc-900">
              <p>
                <span className="font-semibold">Customer:</span>{" "}
                {order.customerName || "Unknown"}
              </p>
              <p>
                <span className="font-semibold">Items:</span>{" "}
                {order.items?.length || 0}
              </p>
              <p>
                <span className="font-semibold">Total:</span> Ksh {order.total}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
