import { z } from "zod";

export const trackingCodeSchema = z
  .string()
  .trim()
  .min(6, { message: "Tracking code must be at least 6 characters" })
  .max(32, { message: "Tracking code must be at most 32 characters" })
  .regex(/^[A-Za-z0-9-]+$/, { message: "Invalid tracking code format" });

export const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Name is required" }).max(100),
  email: z.string().trim().email({ message: "Invalid email address" }),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  destination: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const parcelCreateSchema = z.object({
  recipient: z.string().trim().min(2).max(120),
  recipientEmail: z
    .string()
    .trim()
    .email({ message: "Invalid recipient email address" })
    .optional()
    .or(z.literal("")),
  destination: z.string().trim().min(2).max(160),
  service: z.enum(["PARCEL", "ECOMMERCE", "MAIL", "TRADE", "RETURNS", "FULFILLMENT"]),
  weightKg: z.coerce.number().positive().max(1000).optional(),
  status: z.enum(["CREATED", "IN_TRANSIT", "CUSTOMS", "OUT_FOR_DELIVERY", "DELIVERED", "EXCEPTION"]).default("CREATED"),
});

export const trackingEventCreateSchema = z.object({
  status: z.enum(["CREATED", "IN_TRANSIT", "CUSTOMS", "OUT_FOR_DELIVERY", "DELIVERED", "EXCEPTION"]),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  description: z.string().trim().max(400).optional().or(z.literal("")),
});
