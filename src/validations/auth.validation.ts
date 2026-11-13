
import { z } from 'zod';

export const signinSchema = z.object({
  email: z.email('Enter a valid email'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export type SigninFormValues = z.infer<typeof signinSchema>;

// Signup Schema
export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .min(3, 'Name must be at least 3 characters'),

    email: z.email('Enter a valid email'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),

    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    },
  );

export type SignupFormValues = z.infer<typeof signupSchema>;
