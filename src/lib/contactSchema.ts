import { z } from 'zod'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Length caps mirror .claude/rules/security.md. .max() runs BEFORE .transform(escapeHtml)
// so the cap applies to raw user input — escaping can expand a string (e.g. '<' -> '&lt;').
const MAX_COMPANY = 100
const MAX_EMAIL = 254 // RFC 5321 limit
const MAX_DETAILS = 2000

export const contactSchema = z.object({
  company: z
    .string()
    .trim()
    .min(2, 'Company name must be at least 2 characters')
    .max(MAX_COMPANY, `Company name must be at most ${MAX_COMPANY} characters`)
    .transform(escapeHtml),
  email: z.email().max(MAX_EMAIL, `Email must be at most ${MAX_EMAIL} characters`).transform((v) => v.toLowerCase()),
  details: z
    .string()
    .trim()
    .min(10, 'Please provide at least 10 characters of detail')
    .max(MAX_DETAILS, `Details must be at most ${MAX_DETAILS} characters`)
    .transform(escapeHtml),
})

export type ContactData = z.infer<typeof contactSchema>
