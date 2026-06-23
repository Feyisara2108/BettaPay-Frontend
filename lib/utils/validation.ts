import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  country: z.string({ error: 'Country is required' }).min(1, 'Country is required'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const paymentLinkSchema = z.object({
  label: z.string().min(2, 'Label must be at least 2 characters'),
  type: z.enum(['fixed', 'open']),
  amount: z.string().optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
}).refine(data => {
  if (data.type === 'fixed') {
    return !!data.amount && !!data.currency;
  }
  return true;
}, {
  message: "Amount and currency are required for fixed links",
  path: ["amount"],
});

export type PaymentLinkFormValues = z.infer<typeof paymentLinkSchema>;
