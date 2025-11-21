'use server';

import { z } from 'zod';

const returnSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required.'),
  reason: z.string().min(10, 'Reason must be at least 10 characters long.'),
});

export type State = {
    status: 'SUCCESS' | 'ERROR';
    message: string;
    errors?: Record<string, string[] | undefined>;
} | {
    status: undefined;
    message: string;
    errors: undefined;
};

export async function initiateReturn(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = returnSchema.safeParse({
    orderId: formData.get('orderId'),
    reason: formData.get('reason'),
  });

  if (!validatedFields.success) {
    return {
      status: 'ERROR',
      message: 'Please fix the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { orderId } = validatedFields.data;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (orderId.trim().toUpperCase() === 'XYZ123') {
    return {
      status: 'ERROR',
      message: 'Order ID not found.',
    };
  }

  return {
    status: 'SUCCESS',
    message: 'Return initiated. A return label has been sent to your email.',
  };
}
