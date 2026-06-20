import type {JobRole} from '@/types'
import {sortByMostRecent} from '@/data/projects.ts'

// Images are imported as modules so Astro can optimize them at build time
// (AVIF/WebP, responsive srcset, intrinsic dimensions). See astro.config.mjs.
import atitlanBootPicker from '@/assets/projects/undefined-agency/Atitlan-Leather_Custom-Boot-picker.jpg'
import commandCoffee from '@/assets/projects/undefined-agency/Command-Coffee-Home-CoffeeCalc.jpg'
import stazeCustomTrio from '@/assets/projects/undefined-agency/Staze--Custom_Trio--opt.jpeg'
import stazeHomepage from '@/assets/projects/staze/homepage.jpg'
import stazeProductDetails from '@/assets/projects/staze/product-details_custom-trio.jpeg'
import simplehumanConfig from '@/assets/projects/simplehuman/Simplehuman-product-configuration.jpg'
import simplehumanPersonalization from '@/assets/projects/simplehuman/personalization-form.jpg'
import trueClassicProductCards from '@/assets/projects/true-classic/product-cards+loyalty.jpeg'
import trueClassicMegaMenu from '@/assets/projects/true-classic/mega-menu-5.jpeg'
import trueClassicQuickAdd from '@/assets/projects/true-classic/QuickAddModal.jpeg'
import trueClassicOldQuickAdd from '@/assets/projects/true-classic/old-quick-add.jpeg'

import aMapOfLife from '@/assets/projects/jordanaf-dev/Astrology-and-Tarot-Readings-with-René-Aceves-Rene-Astrology-Tarot-Readings.jpg'
import heatherBorah from '@/assets/projects/jordanaf-dev/HeatherBorah-Homepage.jpg'
import opuntiaFamilyHealing from '@/assets/projects/jordanaf-dev/Opuntia-Healing-Family-Therapy.jpg'
import vintageOctober from '@/assets/projects/jordanaf-dev/Vintage-October_homepage+menu.jpg'
import stazeProductConfigurator from '@/assets/projects/jordanaf-dev/Staze - Product Page.jpg'

export const jobRoles: JobRole[] = [
	{
		type: 'jobRole',
		slug: 'jordanaf-dev',
		title: 'JordanAF Dev',
		subtitle: 'Fullstack Web Developer',
		client: 'Independent Contractor',
		year: 'Mar 2020 - current',
		category: 'Web Development',
		tech: [
			'Shopify',
			'Liquid',
			'JS',
			'HTML',
			'CSS',
			'API Integration',
			'Adobe',
			'Wordpress',
		],
		status: 'COMPLETE',
		description: [
			'Jordan A.F. Development is my independent web development practice, where I work directly with small business owners and e-commerce brands to design, build, and maintain websites tailored to their needs. On the e-commerce side, I do custom Shopify Liquid theme development for brands like Staze and Vintage October — typically working from client-provided designs to build custom sections and features that match their vision with pixel-perfect accuracy. These client relationships originated through Undefined Agency and carried over when the agency dissolved, a testament to the working relationships built along the way.',
			"On the small business side, I consult with clients to advise on design direction and site structure, then handle the full build using Hostinger's website builder and hosting infrastructure — including contact forms, business email setup, scheduling, and SEO fundamentals. Clients have included a therapist practice (AcevesTherapy, Opuntia Family Healing), an astrologer (A Map Of Life), and a makeup artist (Heather Borah). Across all engagements I manage the full client relationship from first conversation to post-launch support, owning project communication, ongoing maintenance, and updates — translating non-technical clients' visions into clean, functional sites while keeping the process straightforward for them.",
		],
		images: [
			vintageOctober,
			stazeProductConfigurator,
			heatherBorah,
			opuntiaFamilyHealing,
			aMapOfLife,
		],
		featured: true,
	},
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
			'JS',
			'HTML',
			'CSS',
			'API Integration',
			'Adobe',
			'GSAP',
			'Wordpress',
			'PHP',
		],
		status: 'COMPLETE',
		description: [
			'As the primary developer at a boutique web design agency specializing in Shopify and WordPress, I built, improved, and optimized over 40 websites across e-commerce, non-profits, local businesses, and medical practices. Adept at taking a site design and translating it into a pixel-perfect, fully responsive implementation using HTML, CSS, and vanilla JavaScript — with deep expertise in Shopify theme development, Liquid templating, and app integration.',
			'Known for leading projects end-to-end and collaborating directly with clients on design decisions, project management, and troubleshooting. Delivers websites that are not only visually compelling but built with performance, SEO, and accessibility in mind — combining technical proficiency in JavaScript, APIs, and Figma with a keen eye for detail to produce polished digital experiences that convert. Highly adaptable to the demands of each project, including picking up new technologies as needed — such as learning PHP to build custom WordPress plugins when off-the-shelf solutions fell short.',
		],
		images: [atitlanBootPicker, commandCoffee, stazeCustomTrio],
		featured: true,
	},
	{
		type: 'jobRole',
		slug: 'staze',
		title: 'Staze',
		subtitle: 'Shopify Developer',
		client: 'Staze',
		year: 'Nov 2021 - Aug 2024',
		category: 'Shopify',
		tech: ['Shopify', 'Liquid', 'JS', 'HTML', 'CSS', 'Illustrator'],
		status: 'COMPLETE',
		description:
			'Maintained and rebuilt the Shopify theme for Staze, a boutique herbal storage brand, translating a fresh redesign into a fully functional storefront. Developed custom templates, sections, and interactive features including pop-ups, dropdowns, and animations to enhance UX/UI and responsiveness using HTML, CSS, JavaScript, and Liquid. Rounded out the role with third-party app integration, performance optimization, SEO improvements, and ongoing technical troubleshooting to keep the store running smoothly.',
		images: [stazeHomepage, stazeProductDetails],
		featured: false,
	},
	{
		type: 'jobRole',
		slug: 'simplehuman',
		title: 'Simplehuman',
		subtitle: 'Shopify Plus Developer',
		client: 'Simplehuman',
		year: 'Dec 2023 - May 2024',
		category: 'Shopify',
		tech: ['Shopify Plus', 'Liquid', 'JS', 'Rest API', 'HTML', 'SCSS', 'Figma'],
		status: 'COMPLETE',
		description: [
			'As one of two Shopify developers on the e-commerce team at Simplehuman I helped maintain an international Shopify Plus store built on a custom theme and CMS system. I was a full-time, on-site contractor collaborating closely with our copywriters, designers, and marketing team to launch new products, build out site features, and keep content fresh across all regions.',
			"Responsibilities ranged from updating product data, to integrating Shopify's search app, and building a custom product configuration form on the PDP. This site used the Slate toolkit for building and compiling Shopify themes and a custom CMS system leveraging metafields. Using Liquid, JavaScript, jQuery, Figma and SCSS I improved site performance, SEO, translations, and metafield management to deliver a unique and enjoyable shopping experience for tens of thousands of daily visitors.",
		],
		images: [simplehumanConfig, simplehumanPersonalization],
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
		tech: [
			'Shopify Plus',
			'Liquid',
			'JS',
			'REST API',
			'HTML',
			'SCSS',
			'React',
			'GraphQL',
			'Figma',
			'Cursor',
			'Devin',
		],
		status: 'COMPLETE',
		description: [
			'As part of a lean, high-velocity frontend team at True Classic, one of the fastest-growing DTC menswear brands in the U.S., I contributed to a Shopify Plus storefront serving over 80,000 daily visitors across 190 global markets. Working within a 3 to 8 person team, I shipped CRO-driven features under shifting priorities, using A/B test data to validate decisions and maximize conversion at every stage of the funnel.',
			"Key deliverables included a lazy-loading multi-collection product grid built to work around Shopify's platform limitations, a Metaobject-driven multi-level mobile menu with animated accordion navigation and breadcrumbs, and a custom internationalization layer handling locale detection, country and language selection, and multi-language support.",
			'On the performance side, I led ongoing codebase modernization efforts covering asset loading optimization, render-blocking resource reduction, and skeleton loading state implementation, resulting in measurable Lighthouse and Core Web Vitals improvements. Third-party integrations spanned TryNow, Monocle, Okendo, Bazaarvoice, Afterpay, Klaviyo, and TrueFit. Beyond individual tasks, I took ownership of production hotfixes, drove features across the finish line, and collaborated closely with teammates to plan, test, and ship work on a fast-moving release cadence.',
		],
		images: [
			trueClassicProductCards,
			trueClassicMegaMenu,
			trueClassicQuickAdd,
			trueClassicOldQuickAdd,
		],
		featured: true,
	},
]

export function getFeaturedJobRoles(): JobRole[] {
	return sortByMostRecent(jobRoles.filter((r) => r.featured))
}
