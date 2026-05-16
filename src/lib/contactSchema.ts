import { z } from 'zod'

export const contactSchema = z.object({
  company: z.string().trim().min(2, 'Company name must be at least 2 characters'),
  email: z.email().transform((v) => v.toLowerCase()),
  details: z.string().trim().min(10, 'Please provide at least 10 characters of detail'),
})

export type ContactData = z.infer<typeof contactSchema>
