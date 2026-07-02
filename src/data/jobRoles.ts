import type {JobRole} from '@/types'
import {sortByMostRecent} from '@/data/projects.ts'

// Images are imported as modules so Astro can optimize them at build time
// (AVIF/WebP, responsive srcset, intrinsic dimensions). See astro.config.mjs.
import atitlanBootPicker from '@/assets/jobs/undefined-agency/Atitlan-Leather_Custom-Boot-picker.jpg'
import commandCoffee from '@/assets/jobs/undefined-agency/Command-Coffee-Home-CoffeeCalc.jpg'
import stazeCustomTrio from '@/assets/jobs/undefined-agency/Staze--Custom_Trio--opt.jpeg'
import stazeHomepage from '@/assets/jobs/staze/homepage.jpg'
import stazeProductDetails from '@/assets/jobs/staze/product-details_custom-trio.jpeg'
import teslerSalonAnimation from '@/assets/jobs/undefined-agency/tesler-salon_gsap-animations.mp4'
import teslerSalonAnimationPoster from '@/assets/jobs/undefined-agency/tesler-salon-scroll-effect-screenshot-opt.jpeg'
import simplehumanConfig from '@/assets/jobs/simplehuman/Simplehuman-product-configuration.jpg'
import simplehumanPersonalization from '@/assets/jobs/simplehuman/personalization-form.jpg'
import simplehumanConfigVideo from '@/assets/jobs/simplehuman/simplehuman-PDP-configuration.mp4'
import trueClassicProductCards from '@/assets/jobs/true-classic/product-cards+loyalty.jpeg'
import trueClassicMegaMenu from '@/assets/jobs/true-classic/mega-menu-5.jpeg'
import trueClassicQuickAdd from '@/assets/jobs/true-classic/QuickAddModal.jpeg'
import trueClassicOldQuickAdd from '@/assets/jobs/true-classic/old-quick-add.jpeg'

import aMapOfLife from '@/assets/jobs/jordanaf-dev/Astrology-and-Tarot-Readings-with-René-Aceves-Rene-Astrology-Tarot-Readings.jpg'
import heatherBorah from '@/assets/jobs/jordanaf-dev/HeatherBorah-Homepage.jpg'
import opuntiaFamilyHealing from '@/assets/jobs/jordanaf-dev/Opuntia-Healing-Family-Therapy.jpg'
import vintageOctober from '@/assets/jobs/jordanaf-dev/Vintage-October_homepage+menu.jpg'
import vintageOctoberTestimonial from '@/assets/jobs/jordanaf-dev/vintage-october_christie-testimonial.jpg'
import stazeProductConfigurator from '@/assets/jobs/jordanaf-dev/Staze - Product Page.jpg'

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
		status: 'ACTIVE',
		description: [
			'Jordan A.F. Development is my independent web development practice, where I work directly with small business owners and e-commerce brands to design, build, and maintain websites tailored to their needs. On the e-commerce side, I do custom Shopify Liquid theme development for brands like Staze and Vintage October — typically working from client-provided designs to build custom sections and features that match their vision with pixel-perfect accuracy. These client relationships originated through Undefined Agency and carried over when the agency dissolved, a testament to the working relationships built along the way.',
			"On the small business side, I consult with clients to advise on design direction and site structure, then handle the full build using Hostinger's website builder and hosting infrastructure — including contact forms, business email setup, scheduling, and SEO fundamentals. Clients have included a therapist practice (AcevesTherapy, Opuntia Family Healing), an astrologer (A Map Of Life), and a makeup artist (Heather Borah). Across all engagements I manage the full client relationship from first conversation to post-launch support, owning project communication, ongoing maintenance, and updates — translating non-technical clients' visions into clean, functional sites while keeping the process straightforward for them.",
		],
		images: [
			{
				src: vintageOctober,
				alt: 'Vintage October homepage',
				caption:
					'Rebuild site from mockup, including custom dropdown menu, countdown timer, sliders, and testimonials section.',
			},
			{
				src: vintageOctoberTestimonial,
				alt: 'Vintage October testimonial',
				caption:
					'"Thankful for Jordan as he made my brand\'s site as beautiful as can be with ease and on time for my tight deadline to launch. Looking forward to continuing to partner on projects and I would recommend him to anyone!"',
			},
			{
				src: stazeProductConfigurator,
				alt: 'Staze product configurator',
				caption:
					'Integrated custom product configurator with dropdowns showing color swatches, along with cart attributes. Allows customer to customize the color combination of the product.',
			},
			{
				src: heatherBorah,
				alt: 'Heather Borah makeup artist homepage with masonry gallery for portfolio imagery',
				caption:
					'Full site build and hosting setup for a makeup artist on Wordpress and Hostinger',
			},
			{
				src: opuntiaFamilyHealing,
				alt: 'Opuntia Family Healing therapy practice homepage',
				caption:
					'Site rebuild on Wix and integrating scheduling and contact forms for a family therapy practice.',
			},
			{
				src: aMapOfLife,
				alt: 'A Map of Life astrology and tarot reading services page',
				caption:
					'Design, consult and full build for an independent astrologer, as well as setting up Google and Yelp business profiles',
			},
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
		images: [
			{
				src: atitlanBootPicker,
				alt: 'Atitlan Leather custom boot picker product page',
				caption:
					'Built a custom slide-out cart with async gift-wrap functionality and leather color swatches featuring zoomed-in popup previews.',
			},
			{
				src: commandCoffee,
				alt: 'Command Coffee homepage',
				caption:
					"Rebuilt homepage from mockup, including a custom JavaScript subscription calculator that recommends bag size and frequency based on the customer's daily coffee intake.",
			},
			{src: stazeCustomTrio},
		],
		videos: [
			{
				src: teslerSalonAnimation,
				poster: teslerSalonAnimationPoster,
				alt: 'Tesler Salon - SVG drawing and scrolling animations using GSAP',
			},
		],
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
		images: [
			{
				src: stazeHomepage,
				alt: 'Staze Homepage',
				caption:
					'Maintained and expanded a Shopify storefront across 3 years delivering iterative feature work, theme updates, and seasonal campaigns',
			},
			{
				src: stazeProductDetails,
				alt: 'Staze Product Page',
				caption:
					'Replaced the default variant selectors with custom color swatch dropdowns and a JavaScript-driven image switcher tied to each color option.',
			},
		],
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
		images: [
			{
				src: simplehumanConfig,
				alt: 'Simplehuman product configuration video',
				caption:
					'Custom product configuration form on the PDP to allow customers to select product options and add-ons, with dynamic image and price updates.',
			},
			{
				src: simplehumanPersonalization,
				alt: 'Simplehuman personalization form',
				caption:
					'Custom personalization form for engraving text and icons on products, with dynamic image update and validation.',
			},
		],
		videos: [
			{
				src: simplehumanConfigVideo,
				poster: simplehumanConfig,
				alt: 'Simplehuman product configuration video',
			},
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
			{src: trueClassicProductCards},
			{src: trueClassicMegaMenu},
			{src: trueClassicQuickAdd},
			{src: trueClassicOldQuickAdd},
		],
		featured: true,
	},
]

export function getFeaturedJobRoles(): JobRole[] {
	return sortByMostRecent(jobRoles.filter((r) => r.featured))
}
