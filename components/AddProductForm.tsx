"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ID, databases, storage } from "@/lib/appwrite";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { getProducts } from "@/lib/actions";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PRODUCTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

// Schema
const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.string().min(1, "Price is required"),
  stock: z.string().min(1, "Stock is required"),
});

type FormOutput = z.infer<typeof formSchema>;

type AddProductFormProps = {
  onProductAdded: (newProducts: any[]) => void;
};

export default function AddProductForm({ onProductAdded }: AddProductFormProps) {
  const form = useForm<FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      stock: "",
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleAddProduct = async (values: FormOutput) => {
    setButtonLoading(true);

    if (!imageFile) {
      toast.error("Please upload a product image");
      setButtonLoading(false);
      return;
    }

    try {
      const uploadedImage = await storage.createFile(BUCKET_ID, ID.unique(), imageFile);
      const imageUrl = storage.getFileDownload(BUCKET_ID, uploadedImage.$id);

      await databases.createDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, ID.unique(), {
        name: values.name,
        price: parseFloat(values.price),
        stock: parseInt(values.stock, 10),
        image: imageUrl,
      });

      toast.success("Product added successfully");

      form.reset();
      setImageFile(null);

      const updatedProducts = await getProducts();
      onProductAdded(updatedProducts);
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setButtonLoading(false);
      setImageFile(null);
    }
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddProduct)} className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Product Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-zinc-700 text-white" />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Price (KES)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="bg-zinc-700 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* Stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Stock</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="bg-zinc-700 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="text-sm border border-gray-600 bg-zinc-800 text-white rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
            />
          </div>

          <Button type="submit" className="w-full" disabled={buttonLoading}>
            {buttonLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Adding product...</span>
              </div>
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
