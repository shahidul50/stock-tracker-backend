import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email format").trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
});

export type LoginDTO = z.infer<typeof loginSchema>;
