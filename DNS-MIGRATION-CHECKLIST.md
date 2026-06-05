# DNS Migration Checklist (moving `jordanaf.com`)

What to preserve and what to drop when moving authoritative DNS to a new provider
(e.g., onto Cloudflare). Auto-import scans are **best-effort and miss records** — especially
on nested subdomains like `resend._domainkey.mailer` — so treat this list, not the scan, as
the source of truth.

## Golden rule: one authoritative DNS provider

A domain points at **one** provider's nameservers. You **cannot** split authority by listing
some Hostinger + some Cloudflare nameservers — the two zones aren't synced, so resolvers get
random/inconsistent answers. Migration order:

1. Recreate every record below in the new provider **first**.
2. Switch the registrar's nameservers to the new provider's full set (Cloudflare gives **two** —
   use both, remove the old ones).
3. Wait for activation/propagation.
4. Re-verify email + site (see "After cutover").

## Records to PRESERVE

- **Website** — served by the `portfolio-site` Cloudflare Worker. Don't hand-copy an A/CNAME;
  attach `jordanaf.com` (and `www`) via **Workers → portfolio-site → Settings → Domains &
  Routes → Add custom domain**, which creates+manages the record (proxied/orange).
- **Email sending (Resend, `mailer.jordanaf.com`)** — source of truth is the **Resend dashboard**
  (Domains → `mailer.jordanaf.com`). Typically:
  - `send.mailer` — **MX** → `feedback-smtp.<region>.amazonses.com` (priority 10)
  - `send.mailer` — **TXT (SPF)** → `v=spf1 include:amazonses.com ~all`
  - `resend._domainkey.mailer` — **TXT (DKIM)** → the long `p=…` key
  - **TXT (DMARC)** if Resend lists one
  Used by `src/pages/api/contact.ts` (sends from `inquiries@mailer.jordanaf.com`). If these are
  missing, Resend returns `200` but the recipient's server fails DKIM/SPF and drops/spam-files
  the mail — a silent failure at the inbox, not in any log.
- **Inbound email at `jordanaf.com`** (if you receive mail there) — the mailbox provider's **MX**
  plus its SPF/DKIM/DMARC TXT records. Verify against your mail host before cutover.
- **Domain-verification TXT records** you still rely on (Google/search console, etc.).

## Records to DROP (host-specific cruft)

- **Hostinger CDN aliases** — `ALIAS/CNAME … → *.cdn.hstgr.net` (e.g., `mailer → mailer.jordanaf.com.cdn.hstgr.net`).
  `mailer` is a send-only mail subdomain, not a website — the CDN alias serves nothing and an
  alias at `mailer` sits awkwardly with the real records on its children. Leave it behind.
- Hostinger `autoconfig`/`autodiscover` mail-client helper records, unless you actually use them.
- Any leftover records from a previous host/mailbox (the original `mail.jordanaf.com` once failed
  Resend verification due to exactly this kind of leftover Titan MX/SPF/DKIM — see CHANGELOG
  2026-06-03).

## Cloudflare specifics

- **Proxy OFF (grey cloud / "DNS only")** for ALL mail records — MX and TXT can't be proxied
  anyway, but if a mail-related CNAME appears, it must stay grey, never orange.
- Only the **website** custom domain is proxied (orange), and the Workers custom-domain flow
  handles that for you.
- Use **only** Cloudflare's two assigned nameservers at the registrar.

## After cutover (verify)

- [ ] Resend dashboard shows `mailer.jordanaf.com` **Verified**.
- [ ] `jordanaf.com` + `www` resolve to the Worker (site loads).
- [ ] Submit a real contact-form inquiry → email arrives from `inquiries@mailer.jordanaf.com`,
      not in spam (confirms DKIM/SPF survived the move).
- [ ] Add the live hostname(s) to the **Turnstile widget → Hostname Management** (else the widget
      throws client error `110200` "domain not authorized").
- [ ] Inbound mail (if any) still delivers.
