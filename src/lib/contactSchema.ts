import { z } from 'zod'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export const contactSchema = z.object({
  company: z.string().trim().min(2, 'Company name must be at least 2 characters').transform(escapeHtml),
  email: z.email().transform((v) => v.toLowerCase()),
  details: z.string().trim().min(10, 'Please provide at least 10 characters of detail').transform(escapeHtml),
})

export type ContactData = z.infer<typeof contactSchema>
