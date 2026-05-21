import type {JobRole} from '../types/index.ts'
import {sortByMostRecent} from './projects.ts'

export const jobRoles: JobRole[] = [
	{
		type: 'jobRole',
		slug: 'undefined-agency',
		title: 'Undefined Agency',
		subtitle: 'Agency Web Developer',
		client: 'Undefined Agency',
		year: 'July 2021 - July 2023',
		category: 'SHOPIFY',
		tech: [
			'Shopify',
			'Liquid',
			'HTML',
			'CSS',
			'JS',
			'API Integration',
			'Adobe',
			'GSAP',
			'Wordpress',
			'PHP',
		],
		status: 'COMPLETE',
		description:
			'As the primary developer at a boutique web design agency specializing in Shopify and WordPress, I built, improved, and optimized over 40 websites across e-commerce, non-profits, local businesses, and medical practices. Adept at taking a site design and translating it into a pixel-perfect, fully responsive implementation using HTML, CSS, and vanilla JavaScript — with deep expertise in Shopify theme development, Liquid templating, and app integration. \n Known for leading projects end-to-end and collaborating directly with clients on design decisions, project management, and troubleshooting. Delivers websites that are not only visually compelling but built with performance, SEO, and accessibility in mind — combining technical proficiency in JavaScript, APIs, and Figma with a keen eye for detail to produce polished digital experiences that convert. Highly adaptable to the demands of each project, including picking up new technologies as needed — such as learning PHP to build custom WordPress plugins when off-the-shelf solutions fell short.',
		responsibilities: '',
		technologies: '',
		images: [
			'/projects/undefined-agency/Atitlan-Leather_Custom-Boot-picker.jpg',
			'/projects/undefined-agency/Command-Coffee-Home-CoffeeCalc.jpg',
			'/projects/undefined-agency/Staze--Custom_Trio--opt.jpeg',
		],
		featured: true,
	},
	{
		type: 'jobRole',
		slug: 'staze',
		title: 'Staze',
		subtitle: 'Maintain Shopify Storefront',
		client: 'Staze',
		year: 'Nov 2021 - Aug 2024',
		category: 'Shopify',
		tech: ['Shopify', 'Liquid', 'HTML', 'CSS', 'JS', 'Illustrator'],
		status: 'COMPLETE',
		description:
			'Maintained and rebuilt the Shopify theme for Staze, a boutique herbal storage brand, translating a fresh redesign into a fully functional storefront. Developed custom templates, sections, and interactive features including pop-ups, dropdowns, and animations to enhance UX/UI and responsiveness using HTML, CSS, JavaScript, and Liquid. Rounded out the role with third-party app integration, performance optimization, SEO improvements, and ongoing technical troubleshooting to keep the store running smoothly.',
		responsibilities: '',
		technologies: '',
		images: [
			'/projects/staze/homepage.jpg',
			'/projects/staze/product-details_custom-trio.jpeg',
		],
		featured: true,
	},
	{
		type: 'jobRole',
		slug: 'simplehuman',
		title: 'Simplehuman',
		subtitle: 'Shopify Plus Developer',
		client: 'Simplehuman',
		year: 'Dec 2023 - May 2024',
		category: 'Shopify',
		tech: [
			'Shopify Plus',
			'Liquid',
			'Storefront API',
			'HTML',
			'CSS',
			'JS',
			'Figma',
		],
		status: 'COMPLETE',
		description:
			"As one of two Shopify developers on the e-commerce team at Simplehuman I helped maintain an international Shopify Plus store built on a custom theme and CMS system. I was a full-time, on-site contractor collaborating closely with our copywriters, designers, and marketing team to launch new products, build out site features, and keep content fresh across all regions. \n\n Responsibilities ranged from updating product data, to integrating Shopify's search app, and building a custom product configuration form on the PDP. This site used the Slate toolkit for building and compiling Shopify themes and a custom CMS system leveraging metafields. Using Liquid, JavaScript, jQuery, Figma and SCSS I improved site performance, SEO, translations, and metafield management to deliver a unique and enjoyable shopping experience for tens of thousands of daily visitors.",
		responsibilities: '',
		technologies: '',
		images: [
			'/projects/chronos-identity/01.jpg',
			'/projects/chronos-identity/02.jpg',
		],
		featured: true,
	},
	{
		type: 'jobRole',
		slug: 'true-classic',
		title: 'True Classic',
		subtitle: 'Shopify Plus Developer',
		client: 'True Classic',
		year: 'July 2024 - Aug 2025',
		category: 'SHOPIFY PLUS',
		tech: ['Shopify Plus', 'Liquid', 'JS', 'React', 'Figma', 'Cursor', 'Devin'],
		status: 'COMPLETE',
		description:
			"As part of a lean, high-velocity frontend team at True Classic, one of the fastest-growing DTC menswear brands in the U.S., I contributed to a Shopify Plus storefront serving over 80,000 daily visitors across 190 global markets. Working within a 3 to 8 person team, I shipped CRO-driven features under shifting priorities, using A/B test data to validate decisions and maximize conversion at every stage of the funnel. \n\n Key deliverables included a lazy-loading multi-collection product grid built to work around Shopify's platform limitations, a Metaobject-driven multi-level mobile menu with animated accordion navigation and breadcrumbs, and a custom internationalization layer handling locale detection, country and language selection, and multi-language support. On the performance side, I led ongoing codebase modernization efforts covering asset loading optimization, render-blocking resource reduction, and skeleton loading state implementation, resulting in measurable Lighthouse and Core Web Vitals improvements. Third-party integrations spanned TryNow, Monocle, Okendo, Bazaarvoice, Afterpay, Klaviyo, and TrueFit. Beyond individual tasks, I took ownership of production hotfixes, drove features across the finish line, and collaborated closely with teammates to plan, test, and ship work on a fast-moving release cadence.",
		responsibilities: '',
		technologies: '',
		images: [
			'/projects/true-classic/product-cards+loyalty.jpeg',
			'/projects/true-classic/mega-menu-5.jpeg',
			'/projects/true-classic/QuickAddModal.jpeg',
			'/projects/true-classic/old-quick-add.jpeg',
		],
		featured: true,
	},
]

export function getFeaturedJobRoles(): JobRole[] {
	return sortByMostRecent(jobRoles.filter((r) => r.featured))
}
