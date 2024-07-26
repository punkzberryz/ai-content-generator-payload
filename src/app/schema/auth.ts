import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})
export type SignInSchema = z.infer<typeof signInSchema>
