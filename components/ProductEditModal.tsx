// components/ProductEditModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { databases } from "@/lib/appwrite";

interface ProductEditModalProps {
  product: any;
  onClose: () => void;
  onSave: () => void;
}

export default function ProductEditModal({ product, onClose, onSave }: ProductEditModalProps) {
  const [name, setName] = useState(product.name || "");
  const [price, setPrice] = useState(product.price || 0);
  const [stock, setStock] = useState(product.stock || 0);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
        product.$id,
        { name, price, stock }
      );

      toast.success("Product updated successfully");
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-black border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-neutral-800 border-neutral-600 text-white"
            />
          </div>

          <div>
            <Label>Price (Ksh)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="bg-neutral-800 border-neutral-600 text-white"
            />
          </div>

          <div>
            <Label>Stock</Label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="bg-neutral-800 border-neutral-600 text-white"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose} variant="ghost">Cancel</Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
