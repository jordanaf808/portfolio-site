import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { validateContact } from '../../lib/validateContact.ts';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = validateContact(body);
  if (!result.valid) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { company, budget, details, email } = result.data;
  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: 'Portfolio Inquiry <inquiries@thecommerceboutique.com>',
    to: ['jordanafdev@gmail.com'],
    replyTo: email,
    subject: `New Inquiry: ${company} — ${budget}`,
    html: `
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Budget:</strong> ${budget}</p>
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
