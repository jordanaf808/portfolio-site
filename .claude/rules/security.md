---
paths:
  - 'src/pages/api/**'
  - 'src/**/*.ts'
  - 'src/**/*.tsx'
---

# Security

## Contact Form

The contact form is the only user-facing attack surface. Treat it accordingly.

### Input Validation (server-side, always)

Validate in the API route before calling Resend — never trust the client-side form:

```ts
const MAX_NAME = 100
const MAX_EMAIL = 254 // RFC 5321 limit
const MAX_MESSAGE = 2000

// Required checks
if (!name || typeof name !== 'string' || name.trim().length === 0) {
	/* 400 */
}
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
	/* 400 */
}
if (!message || message.trim().length < 10) {
	/* 400 */
}

// Length limits — prevent abuse
if (name.length > MAX_NAME || message.length > MAX_MESSAGE) {
	/* 400 */
}
```

- Strip leading/trailing whitespace from all string inputs before using them
- Return generic error messages to the client (`"Invalid request"`) — log details server-side
- Return `400` for validation failures, `500` (with no details) for Resend errors

### Rate Limiting

Cloudflare Pages has no built-in rate limiting on API routes — consider:

- Cloudflare WAF rules (zone-level) to rate-limit `/api/contact` by IP
- Or a simple in-memory counter with a short TTL (note: Cloudflare Workers are stateless per-request — use Cloudflare KV for persistent rate limiting)
- At minimum: validate on the server so spam bots get `400` quickly and don't reach Resend

### Environment Secrets

- `RESEND_API_KEY` must only ever be accessed via `import.meta.env.RESEND_API_KEY` in server-side code
- Never reference `RESEND_API_KEY` in any `.astro` template or `.tsx` file — it would be bundled into client JS
- Never log the key, even partially
- If the key is ever committed or logged, rotate it immediately in Resend dashboard + Cloudflare Pages

## Cloudflare Pages Headers

Set security headers in `public/_headers` (Cloudflare Pages static header file):

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; connect-src 'self'
```

Adjust CSP as needed when adding new external resources.

## Dependencies

- Run `pnpm audit` before adding any new package
- This is a static portfolio — keep the dependency list minimal
- Any new npm package should be evaluated for: bundle size impact, maintenance status, and whether a vanilla solution exists

## No Sensitive Data in Static Output

- `pnpm build` should never output secrets, API keys, or internal URLs into `dist/`
- Cloudflare Pages environment variables are server-only by default — do not prefix with `PUBLIC_` unless the value is intentionally public
