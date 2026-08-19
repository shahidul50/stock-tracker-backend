import { z } from "zod";

export const stockOutItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  type: z.union([z.literal("Sell"), z.literal("Damage"), z.literal("Lost")]),
});

export const stockOutSchema = z.object({
  items: z.array(stockOutItemSchema).min(1, "At least one item is required"),
});

export type StockOutDTO = z.infer<typeof stockOutSchema>;
export type StockOutItemDTO = z.infer<typeof stockOutItemSchema>;
