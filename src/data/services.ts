export interface Service {
	kicker: string
	title: string
	line: string
	marquee: string
}

export interface TechBadge {
	src: string
	name: string
}

export const services: Service[] = [
	{
		kicker: 'Theme Development',
		title: 'Shopify Plus Development',
		line: 'Custom themes and storefronts engineered to scale across global markets.',
		marquee: 'Shopify Plus',
	},
	{
		kicker: 'CRO & Experimentation',
		title: 'Conversion Optimization',
		line: 'A/B-tested features validated by data — built to move the funnel.',
		marquee: 'Conversion',
	},
	{
		kicker: 'Core Web Vitals',
		title: 'Performance Engineering',
		line: 'Measurable Lighthouse and Core Web Vitals gains, won line by line.',
		marquee: 'Performance',
	},
	{
		kicker: 'Systems & Data',
		title: 'App & API Integration',
		line: 'Storefront API, metafields, and third-party tooling wired in cleanly.',
		marquee: 'Integration',
	},
	{
		kicker: 'JS / TS Engineering',
		title: 'Headless & Frontend',
		line: 'React, Next, and TypeScript interfaces for commerce beyond the theme.',
		marquee: 'Headless',
	},
	{
		kicker: 'Global Commerce',
		title: 'Internationalisation',
		line: 'Locale, currency, and language handling across 190+ markets.',
		marquee: 'Worldwide',
	},
]

import shopifySvg from '../assets/badges/shopify-8bit-logo.svg?url'
import reactSvg from '../assets/badges/react-8bit-logo.svg?url'
import nextjsSvg from '../assets/badges/nextjs-8bit-logo.svg?url'
import expressSvg from '../assets/badges/express-8bit-logo.svg?url'
import mongodbSvg from '../assets/badges/mongodb-8bit-logo.svg?url'
import dockerSvg from '../assets/badges/docker-8bit-logo.svg?url'
import css3Svg from '../assets/badges/ccs3-8bit-badge-opt.svg?url'

import jsSvg from '../assets/badges/js-144-pixel.svg?url'
import html5Svg from '../assets/badges/html-5-144-pixel.svg?url'
import nodeJsSvg from '../assets/badges/nodejs-144-pixel.svg?url'
import postgresSvg from '../assets/badges/postgresql-48-pixel.svg?url'
import reduxSvg from '../assets/badges/redux-144-pixel.svg?url'
import twCssSvg from '../assets/badges/tailwind-css-144-pixel.svg?url'
import tanstackSvg from '../assets/badges/tanstack-100-pixel.svg?url'

export const techBadges: TechBadge[] = [
	{src: shopifySvg, name: 'Shopify'},
	{src: nodeJsSvg, name: 'NodeJS'},
	{src: reactSvg, name: 'React'},
	{src: nextjsSvg, name: 'Next.js'},
	{src: tanstackSvg, name: 'TanStack'},
	{src: expressSvg, name: 'Express'},
	{src: mongodbSvg, name: 'MongoDB'},
	{src: postgresSvg, name: 'PostgreSQL'},
	{src: dockerSvg, name: 'Docker'},
	{src: reduxSvg, name: 'Redux'},
	{src: twCssSvg, name: 'Tailwind CSS'},
	{src: html5Svg, name: 'HTML'},
	{src: css3Svg, name: 'CSS3'},
	{src: jsSvg, name: 'JavaScript'},
]
