import { z } from 'zod';

export const createServerSchema = z.object({
    name: z.string().min(1, "Name is required").max(32, "Name is too long"),
    
})

export type CreateServerSchema = z.infer<typeof createServerSchema>;