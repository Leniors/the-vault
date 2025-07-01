import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), { message: "Price must be a valid number" }),
  stock: z
    .string()
    .min(1, "Stock is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: "Stock must be a valid number" }),
});
