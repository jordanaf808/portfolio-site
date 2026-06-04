import {useState, useEffect, useRef, useCallback} from 'react'
import {PUBLIC_TURNSTILE_SITE_KEY} from 'astro:env/client'
import type {ContactFormData} from '@/types'

type Status = 'idle' | 'loading' | 'success' | 'error'

// Explicit-render build: we call turnstile.render() ourselves once the widget div is mounted,
// rather than letting api.js auto-scan the DOM for .cf-turnstile elements.
const TURNSTILE_SRC =
	'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

// Minimal surface of the global injected by api.js — typed to avoid `any` under strict mode.
interface TurnstileApi {
	render: (
		el: HTMLElement,
		opts: {
			sitekey: string
			callback: (token: string) => void
			'expired-callback'?: () => void
			'error-callback'?: () => void
		},
	) => string
	reset: (id?: string) => void
}

declare global {
	interface Window {
		turnstile?: TurnstileApi
	}
}

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function CartDrawer(): React.ReactElement | null {
	const [isOpen, setIsOpen] = useState(false)
	const [status, setStatus] = useState<Status>('idle')
	const [errorMsg, setErrorMsg] = useState('')
	const [form, setForm] = useState<ContactFormData>({
		company: '',
		details: '',
		email: '',
	})
	const [token, setToken] = useState('')
	const [scriptLoaded, setScriptLoaded] = useState(false)
	const drawerRef = useRef<HTMLElement>(null)
	const triggerRef = useRef<Element | null>(null)
	const turnstileRef = useRef<HTMLDivElement>(null)
	const widgetIdRef = useRef<string | null>(null)

	useEffect(() => {
		const handler = (): void => {
			triggerRef.current = document.activeElement
			setIsOpen(true)
		}
		document.addEventListener('open-cart-drawer', handler)
		return () => document.removeEventListener('open-cart-drawer', handler)
	}, [])

	// Lazy-load the Turnstile script the first time the drawer opens. The drawer mounts on
	// every page via Layout, so deferring this keeps the request off the initial page load.
	useEffect(() => {
		if (!isOpen || scriptLoaded) return
		if (window.turnstile) {
			setScriptLoaded(true)
			return
		}
		const existing = document.querySelector<HTMLScriptElement>(
			`script[src="${TURNSTILE_SRC}"]`,
		)
		if (existing) {
			existing.addEventListener('load', () => setScriptLoaded(true))
			return
		}
		const script = document.createElement('script')
		script.src = TURNSTILE_SRC
		script.async = true
		script.onload = () => setScriptLoaded(true)
		document.head.appendChild(script)
	}, [isOpen, scriptLoaded])

	// Render the widget once the script is ready and the form (and its container div) is in
	// the DOM. Guard on success: the form unmounts on success, taking the container with it.
	useEffect(() => {
		if (!scriptLoaded || status === 'success') return
		if (widgetIdRef.current !== null) return
		const el = turnstileRef.current
		if (!el || !window.turnstile) return
		widgetIdRef.current = window.turnstile.render(el, {
			sitekey: PUBLIC_TURNSTILE_SITE_KEY,
			callback: setToken,
			'expired-callback': () => setToken(''),
			'error-callback': () => setToken(''),
		})
	}, [scriptLoaded, status])

	// Move focus into drawer when it opens
	useEffect(() => {
		if (!isOpen || !drawerRef.current) return
		const first = drawerRef.current.querySelector<HTMLElement>(FOCUSABLE)
		first?.focus()
	}, [isOpen])

	const handleClose = useCallback((): void => {
		setIsOpen(false)
		const trigger = triggerRef.current
		if (trigger instanceof HTMLElement) trigger.focus()
	}, [])

	// Trap Tab focus inside drawer
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLElement>): void => {
			if (e.key === 'Escape') {
				handleClose()
				return
			}
			if (e.key !== 'Tab' || !drawerRef.current) return
			const focusable = Array.from(
				drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
			).filter((el) => el.offsetParent !== null)
			if (focusable.length === 0) return
			const first = focusable[0]
			const last = focusable[focusable.length - 1]
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault()
				last.focus()
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault()
				first.focus()
			}
		},
		[handleClose],
	)

	function handleChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	): void {
		setForm((prev) => ({...prev, [e.target.name]: e.target.value}))
	}

	// Turnstile tokens are single-use; issue a fresh one before the user can retry.
	function resetTurnstile(): void {
		if (widgetIdRef.current !== null && window.turnstile) {
			window.turnstile.reset(widgetIdRef.current)
		}
		setToken('')
	}

	async function handleSubmit(): Promise<void> {
		setStatus('loading')
		setErrorMsg('')
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({...form, turnstileToken: token}),
			})
			const data = (await res.json()) as {success?: boolean; error?: string}
			if (!res.ok) {
				setStatus('error')
				setErrorMsg(data.error ?? 'Something went wrong')
				resetTurnstile()
			} else {
				setStatus('success')
			}
		} catch {
			setStatus('error')
			setErrorMsg('Network error — please try again')
			resetTurnstile()
		}
	}

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black/20 z-40'
					onClick={handleClose}
				/>
			)}

			{/* Screen-reader status announcement */}
			<div aria-live='polite' className='sr-only'>
				{status === 'success' && 'Message sent successfully.'}
				{status === 'error' && errorMsg}
			</div>

			{/* Drawer panel */}
			<aside
				ref={drawerRef}
				role='dialog'
				aria-modal='true'
				aria-label='Request Engagement'
				onKeyDown={handleKeyDown}
				className={`drawer-shadow fixed top-0 right-0 h-full w-[480px] max-w-full bg-surface border-l border-primary z-50 flex flex-col transition-transform duration-300 ease-in-out ${
					isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+32px)]'
				}`}
			>
				{/* Header */}
				<div className='flex items-start justify-between p-6 pb-5 border-b border-primary flex-shrink-0'>
					<div>
						<p className='font-mono text-xs uppercase tracking-widest text-muted'>
							Request Engagement
						</p>
						<p className='font-display text-4xl leading-8 text-text mt-4'>
							Get In Touch
						</p>
					</div>
					<button
						onClick={handleClose}
						className='font-mono text-xs uppercase tracking-widest text-muted hover:text-text transition-colors mt-1'
					>
						Close ✕
					</button>
				</div>

				{/* Order summary */}
				<div className='p-6 border-b border-primary flex-shrink-0'>
					<div className='border border-primary hard-shadow'>
						<div className='flex justify-between p-4 border-b border-primary'>
							<span className='font-mono text-xs uppercase tracking-widest text-muted'>
								Item
							</span>
							<span className='font-mono text-xs uppercase tracking-widest text-muted'>
								Qty
							</span>
						</div>
						<div className='flex items-center justify-between p-4'>
							<div>
								<p className='font-display text-sm text-text'>
									Freelance Developer Engagement
								</p>
								<p className='font-mono text-xs text-muted mt-0.5'>
									Specialized Shopify & JS/TS Services
								</p>
							</div>
							<span className='font-mono text-xs text-muted'>1×</span>
						</div>
					</div>
				</div>

				{/* Success state */}
				{status === 'success' ?
					<div className='flex-1 flex items-center justify-center p-12 text-center'>
						<div>
							<p className='font-display text-3xl text-text mb-4'>
								Message Sent
							</p>
							<p className='font-mono text-xs text-muted uppercase tracking-widest'>
								We'll be in touch within 24 hours.
							</p>
						</div>
					</div>
				:	<form
						onSubmit={(e) => {
							e.preventDefault()
							void handleSubmit()
						}}
						className='flex-1 overflow-y-auto p-6 flex flex-col gap-6'
					>
						<label className='flex flex-col gap-1'>
							<span className='font-mono text-xs uppercase tracking-widest text-muted'>
								Company Name
							</span>
							<input
								type='text'
								name='company'
								value={form.company}
								onChange={handleChange}
								placeholder='Enter your organization'
								required
								minLength={2}
								maxLength={100}
								className='bg-transparent border-b border-primary py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-b-2 focus:ring-0 transition-all'
							/>
						</label>

						<label className='flex flex-col gap-1'>
							<span className='font-mono text-xs uppercase tracking-widest text-muted'>
								Project Details
							</span>
							<textarea
								name='details'
								value={form.details}
								onChange={handleChange}
								placeholder='Briefly describe your technical objectives'
								required
								minLength={10}
								maxLength={2000}
								rows={4}
								className='bg-transparent border-b border-primary py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-b-2 focus:ring-0 transition-all resize-none'
							/>
						</label>

						<label className='flex flex-col gap-1'>
							<span className='font-mono text-xs uppercase tracking-widest text-muted'>
								Contact Email
							</span>
							<input
								type='email'
								name='email'
								value={form.email}
								onChange={handleChange}
								placeholder='email@domain.com'
								required
								maxLength={254}
								className='bg-transparent border-b border-primary py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-b-2 focus:ring-0 transition-all'
							/>
						</label>

						{/* Turnstile renders its widget here once api.js loads (see render effect). */}
						<div ref={turnstileRef} className='flex-shrink-0' />

						{errorMsg && (
							<p className='font-mono text-xs text-red-600'>{errorMsg}</p>
						)}

						<div className='mt-auto flex flex-col gap-3'>
							<button
								type='submit'
								disabled={status === 'loading' || !token}
								className='font-mono w-full bg-primary text-surface text-xs uppercase tracking-widest py-4 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50'
							>
								{status === 'loading' ? 'Sending…' : 'Place Order'}
							</button>
							<p className='font-mono text-xs text-muted text-center'>
								discounts applied at checkout
							</p>
						</div>
					</form>
				}
			</aside>
		</>
	)
}
