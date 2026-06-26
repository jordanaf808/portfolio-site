import {defineConfig, envField} from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

// 'compile' runs Sharp at build time (Node) to pre-optimize prerendered images.
// The v13 dev server runs inside workerd, where Sharp's CommonJS entry throws
// "module is not defined". 'passthrough' serves unoptimized originals in dev (no Sharp);
// production builds still get full optimization.
const isDev = process.argv.includes('dev')

// Dev-only React desync fix. The v13 Cloudflare adapter runs the dev SSR inside
// workerd via @cloudflare/vite-plugin, which optimizes server deps into a
// separate `deps_ssr` pass. When Vite discovers a dep lazily (here:
// `astro/assets/services/noop`, the passthrough image service the services page
// pulls in on first render) it re-optimizes and reloads the worker mid-render,
// leaving react-dom/server holding a stale React whose hook dispatcher is null —
// the "Invalid hook call / Cannot read properties of null (useState)" crash.
// Pre-bundling everything in ONE pass at startup removes the lazy discovery.
// Full writeup: docs/react-workerd-invalid-hook-call.md
// Upstream: https://github.com/withastro/astro/issues/16529
const SERVER_OPTIMIZE_DEPS = [
	'react',
	'react-dom',
	'react-dom/server.edge',
	'react-dom/client',
	'react/jsx-runtime',
	// The Astro internal that gets discovered lazily on first image render in dev.
	'astro/assets/services/noop',
]

// SSR is its own Vite environment under @cloudflare/vite-plugin, so
// `vite.ssr.optimizeDeps` never reaches it — `configEnvironment` is the only
// hook that does. Apply the include list to every non-client environment.
function optimizeServerDeps() {
	return {
		name: 'optimize-server-deps',
		configEnvironment(name) {
			if (name !== 'client') {
				return {optimizeDeps: {include: SERVER_OPTIMIZE_DEPS}}
			}
		},
	}
}

// In dev the worker needs the Web-Streams ("edge") build of react-dom/server;
// forcing it keeps a single react-dom/server build across the Node and workerd
// graphs so React's dispatcher can't desync. Production prerenders in Node and
// uses the default build, so this alias is intentionally dev-only.
const devReactDomAlias =
	isDev ? {'react-dom/server': 'react-dom/server.edge'} : {}

export default defineConfig({
	// SEOHead.astro uses this to build absolute canonical and og:image URLs.
	site: 'https://jordanaf.com',
	adapter: cloudflare({imageService: isDev ? 'passthrough' : 'compile'}),
	// define env vars used in the app, with context and access control.
	env: {
		schema: {
			RESEND_API_KEY: envField.string({context: 'server', access: 'secret'}),
			PUBLIC_TURNSTILE_SITE_KEY: envField.string({
				context: 'client',
				access: 'public',
			}),
			TURNSTILE_SECRET_KEY: envField.string({
				context: 'server',
				access: 'secret',
			}),
		},
	},
	// CSP is inert in `dev` (Vite).
	// Built-in CSP: Astro hashes every inline script/style it emits at build time and
	// injects a <meta http-equiv="content-security-policy"> per page — no 'unsafe-inline'.
	// script-src ('self' + sha256 hashes) is added automatically; we only declare the rest.
	security: {
		csp: {
			directives: [
				"default-src 'self'",
				"img-src 'self' data:",
				"font-src 'self' https://fonts.gstatic.com",
				// Turnstile's api.js may issue client-side requests back to its host.
				"connect-src 'self' https://challenges.cloudflare.com",
				// Turnstile renders the challenge in an iframe from this host. No frame-src
				// existed before, so it fell back to default-src 'self' and would block it.
				'frame-src https://challenges.cloudflare.com',
			],
			// style and script resources REPLACES the default script/style-src sources, so 'self' must be re-listed;
			// Astro still appends its own per-build inline-script hashes after these.
			scriptDirective: {
				resources: ["'self'", 'https://challenges.cloudflare.com'],
			},
			styleDirective: {
				resources: ["'self'", 'https://fonts.googleapis.com'],
			},
		},
	},
	integrations: [react()],
	vite: {
		plugins: [tailwindcss(), optimizeServerDeps()],
		resolve: {
			dedupe: ['react', 'react-dom'],
			alias: devReactDomAlias,
		},
		// Same React entry points for the client graph so the browser doesn't churn.
		optimizeDeps: {
			include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
		},
	},
})
