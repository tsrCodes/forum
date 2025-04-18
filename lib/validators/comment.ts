import { z } from "zod";

export const commentSchema = z.object({
    content: z.string().min(3),
});

export type CommentSchemaType = z.infer<typeof commentSchema>
