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
import jsSvg from '../assets/badges/js-8-bit-badge.svg?url'
import reactSvg from '../assets/badges/react-8bit-logo.svg?url'
import nextjsSvg from '../assets/badges/nextjs-8bit-logo.svg?url'
import expressSvg from '../assets/badges/express-8bit-logo.svg?url'
import mongodbSvg from '../assets/badges/mongodb-8bit-logo.svg?url'
import dockerSvg from '../assets/badges/docker-8bit-logo.svg?url'
import css3Svg from '../assets/badges/ccs3-8bit-badge-opt.svg?url'
import blankSlateSvg from '../assets/badges/blank-slate-badge.svg?url'

export const techBadges: TechBadge[] = [
  { src: shopifySvg, name: 'Shopify' },
  { src: jsSvg, name: 'JavaScript' },
  { src: reactSvg, name: 'React' },
  { src: nextjsSvg, name: 'Next.js' },
  { src: expressSvg, name: 'Express' },
  { src: mongodbSvg, name: 'MongoDB' },
  { src: dockerSvg, name: 'Docker' },
  { src: css3Svg, name: 'CSS3' },
  { src: blankSlateSvg, name: '& More' },
]
