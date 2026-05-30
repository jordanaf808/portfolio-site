import {useState, useEffect} from 'react'
import type {ContactFormData} from '@/types'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function CartDrawer(): React.ReactElement | null {
	const [isOpen, setIsOpen] = useState(false)
	const [status, setStatus] = useState<Status>('idle')
	const [errorMsg, setErrorMsg] = useState('')
	const [form, setForm] = useState<ContactFormData>({
		company: '',
		details: '',
		email: '',
	})

	useEffect(() => {
		const handler = (): void => setIsOpen(true)
		document.addEventListener('open-cart-drawer', handler)
		return () => document.removeEventListener('open-cart-drawer', handler)
	}, [])

	function handleChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	): void {
		setForm((prev) => ({...prev, [e.target.name]: e.target.value}))
	}

	async function handleSubmit(): Promise<void> {
		setStatus('loading')
		setErrorMsg('')
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(form),
			})
			const data = (await res.json()) as {success?: boolean; error?: string}
			if (!res.ok) {
				setStatus('error')
				setErrorMsg(data.error ?? 'Something went wrong')
			} else {
				setStatus('success')
			}
		} catch {
			setStatus('error')
			setErrorMsg('Network error — please try again')
		}
	}

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black/20 z-40'
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Drawer panel */}
			<aside
				role='dialog'
				aria-modal='true'
				aria-label='Request Engagement'
				className={`fixed top-0 right-0 h-full w-[480px] max-w-full bg-surface border-l border-primary z-50 flex flex-col transition-transform duration-300 ease-in-out ${
					isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+32px)]'
				}`}
				style={{boxShadow: '-8px 0 24px -4px rgba(17,17,17,0.18)'}}
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
						onClick={() => setIsOpen(false)}
						className='font-mono text-xs uppercase tracking-widest text-muted hover:text-text transition-colors mt-1'
					>
						Close ✕
					</button>
				</div>

				{/* Order summary */}
				<div className='p-6 border-b border-primary flex-shrink-0'>
					<div
						className='border border-primary'
						style={{boxShadow: '8px 8px 0px 0px rgba(17,17,17,0.05)'}}
					>
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
								className='bg-transparent border-b border-primary py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-b-2 transition-all'
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
								rows={4}
								className='bg-transparent border-b border-primary py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-b-2 transition-all resize-none'
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
								className='bg-transparent border-b border-primary py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-b-2 transition-all'
							/>
						</label>

						{errorMsg && (
							<p className='font-mono text-xs text-red-600'>{errorMsg}</p>
						)}

						<div className='mt-auto flex flex-col gap-3'>
							<button
								type='submit'
								disabled={status === 'loading'}
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
