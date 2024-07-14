import { ChannelType } from '@enums/channels/ChannelType';
import { z } from 'zod';

export const createServerChannelSchema = z.object({
    name: z.string().min(1, 'Name is required').max(32, 'Name is too long'),
    // TODO: Fix this toString shit
    type: z
        .enum([ChannelType.Text.toString()])
        .default(ChannelType.Text.toString())
});

export type CreateServerChannelSchema = z.infer<
    typeof createServerChannelSchema
>;
