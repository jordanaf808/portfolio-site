import type { APIRoute } from 'astro';
import { RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { Resend } from 'resend';
import { validateContact } from '../../lib/validateContact.ts';

export const prerender = false;

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Calls Cloudflare siteverify. The widget alone proves nothing — this server-side check is
// the actual bot defense, so a non-true outcome (or any network failure) must block sending.
async function verifyTurnstile(
  token: string,
  remoteip: string | undefined,
): Promise<boolean> {
  const params = new URLSearchParams({
    secret: TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (remoteip) params.set('remoteip', remoteip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const outcome = (await res.json()) as { success?: boolean };
    return outcome.success === true;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Same-origin guard: browsers send Origin on cross-site POSTs, so reject those before doing
  // any work. Comparing to the request's own origin auto-covers prod, *.workers.dev previews,
  // and localhost. A missing Origin (curl, server-to-server) isn't a browser cross-site request
  // and still has to clear the Turnstile gate below, so it's allowed through here.
  const origin = request.headers.get('origin');
  if (origin !== null && origin !== new URL(request.url).origin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Turnstile gate — pulled straight off the raw body (it never enters the Zod schema, which
  // strips unknown keys) and verified before any validation or send. Reject if it fails.
  const token =
    typeof body === 'object' && body !== null && 'turnstileToken' in body
      ? (body as { turnstileToken?: unknown }).turnstileToken
      : undefined;
  if (typeof token !== 'string' || token.length === 0 || !(await verifyTurnstile(token, clientAddress))) {
    return new Response(JSON.stringify({ error: 'Verification failed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = validateContact(body);
  if (!result.valid) {
    const firstError = Object.values(result.errors)[0] ?? 'Invalid request';
    return new Response(JSON.stringify({ error: firstError }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { company, details, email } = result.data;
  const resend = new Resend(RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: 'Portfolio Inquiry <inquiries@mailer.jordanaf.com>',
    to: ['jordanafdev@gmail.com'],
    replyTo: email,
    subject: `New Inquiry: ${company}`,
    html: `
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Contact:</strong> ${email}</p>
      <hr/>
      <p>${details.replace(/\n/g, '<br/>')}</p>
    `,
  });

  if (error) {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
