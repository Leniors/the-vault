"use server";

import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const ordersCollectionId =
  process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!;
const usersCollectionId =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
const productsCollectionId =
  process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

export async function submitOrderAction(
  formData: any,
  items: any[],
  total: number
) {
  try {
    // Extract only the name and quantity
    const simplifiedItems = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
    }));

    await databases.createDocument(databaseId, ordersCollectionId, "unique()", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      paymentType: formData.payment,
      total,
      status: "pending",
      items: JSON.stringify(simplifiedItems), // Save as JSON string
    });

    return { success: true };
  } catch (err) {
    console.error("Appwrite order submission error:", err);
    return { success: false, message: "Failed to save order" };
  }
}

export async function getUserById(userId: string) {
  try {
    const result = await databases.listDocuments(
      databaseId,
      usersCollectionId,
      [Query.equal("userId", userId), Query.limit(1)]
    );

    return result.documents[0] || null;
  } catch (err) {
    console.error("Failed to fetch user by ID:", err);
    return null;
  }
}

export async function getProducts() {
  try {
    const result = await databases.listDocuments(
      databaseId,
      productsCollectionId
    );
    return result.documents;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

export async function getProductById(productId: string) {
  try {
    console.log("Fetching product with ID:", productId);
    return await databases.getDocument(
      databaseId,
      productsCollectionId,
      productId
    );
  } catch (err) {
    console.error("Error fetching product:", err);
    return null;
  }
}
