import { z } from "zod";

export const registerSchema = z
    .object({
        name: z.string().min(2, {
            message: "Name must be at least 2 characters.",
        }),
        email: z.string().email({
            message: "Please enter a valid email address.",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
    })


export type RegisterSchemaType = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    email: z.string().email({ message: "Enter a valid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>