import { z } from "zod";

export const forumSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10),
    tags: z.array(z.string()).optional(),
});

export type ForumSchemaType = z.infer<typeof forumSchema>
