import { ChannelType } from '@enums/channels/ChannelType';
import { z } from 'zod';

export const createServerChannelSchema = z.object({
    name: z.string().min(1, 'Name is required').max(32, 'Name is too long'),
    type: z
        .number().min(0).max(0)
        
});

export type CreateServerChannelSchema = z.infer<
    typeof createServerChannelSchema
>;
