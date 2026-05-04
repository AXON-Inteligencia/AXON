import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createAppSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().optional(),
  shortDescription: z.string().optional(),
  apkLink: z.string().optional(),
  aboutApp: z.string().optional(),
  images: z.array(z.string()).optional(),
  siteUrl: z.string().optional(),
});

export const updateAppSchema = createAppSchema.extend({
  id: z.number(),
});

export const createClientSchema = z.object({
  name: z.string().min(1),
  orderNumber: z.string().min(1),
  address: z.string().optional(),
  product: z.string().optional(),
  trackingLink: z.string().optional(),
});

export const trackingConfigSchema = z.object({
  title: z.string().optional(),
  buttonText: z.string().optional(),
  pixValue: z.string().optional(),
  pixKey: z.string().optional(),
  message: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAppInput = z.infer<typeof createAppSchema>;
export type UpdateAppInput = z.infer<typeof updateAppSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type TrackingConfigInput = z.infer<typeof trackingConfigSchema>;

export interface App {
  id: number;
  name: string;
  logoUrl: string;
  shortDescription: string;
  apkLink: string;
  aboutApp: string;
  images: string[];
  siteUrl: string;
  userId: number;
}

export interface Client {
  id: number;
  name: string;
  orderNumber: string;
  address: string;
  product: string;
  trackingLink: string;
  userId: number;
  createdAt: string;
}

export interface TrackingConfig {
  id: number;
  title: string;
  buttonText: string;
  pixValue: string;
  pixKey: string;
  message: string;
  userId: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}
