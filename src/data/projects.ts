import type { Project } from '../types/index.ts';

export const projects: Project[] = [
  {
    slug: 'lavenir-haute',
    title: "L'Avenir Haute",
    subtitle: 'Headless Commerce & Motion System',
    client: "L'Avenir",
    year: 2024,
    category: 'SHOPIFY PLUS',
    tech: ['React', 'Shopify Hydrogen', 'GSAP', 'TypeScript'],
    status: 'ACTIVE',
    description:
      'A highly-tailored headless commerce experience pushing the boundaries of Liquid and Hydrogen to deliver sub-100ms LCP on product pages featuring 4K 3D assets.',
    challenge:
      'Traditional e-commerce platforms struggle with high-fidelity media at scale. The client required full editorial control without sacrificing Core Web Vitals.',
    architecture:
      'Custom Sanity.io studio for content orchestration, Shopify Hydrogen for commerce, GSAP for frame-accurate motion design.',
    results:
      '42% increase in average session duration. 12% boost in conversion rate. Perfect Lighthouse scores on all product pages.',
    images: ['/projects/lavenir-haute/01.jpg', '/projects/lavenir-haute/02.jpg'],
    featured: true,
  },
  {
    slug: 'chronos-identity',
    title: 'Chronos Identity',
    subtitle: 'Full-Stack Application & API Design',
    client: 'Chronos',
    year: 2024,
    category: 'HYDROGEN',
    tech: ['Next.js', 'TypeScript', 'Shopify Storefront API', 'Vercel Edge'],
    status: 'ACTIVE',
    description:
      'A bespoke full-stack identity and commerce platform for a premium watch brand, built on Next.js App Router with Shopify as the commerce backbone.',
    challenge:
      'The client needed a fully custom PDP experience with real-time configurator, not achievable with standard theme customization.',
    architecture:
      'Next.js App Router with React Server Components, Shopify Storefront API for product data, Vercel Edge Functions for personalization.',
    results: '3× faster page loads vs. prior theme. Configurator added $340 average to cart value.',
    images: ['/projects/chronos-identity/01.jpg', '/projects/chronos-identity/02.jpg'],
    featured: true,
  },
  {
    slug: 'maison-studio',
    title: 'Maison Studio',
    subtitle: 'Bespoke Internal Logistics Tooling',
    client: 'Maison Studio',
    year: 2023,
    category: 'CUSTOM APP',
    tech: ['React', 'Shopify App Bridge', 'TypeScript', 'PostgreSQL'],
    status: 'ACTIVE',
    description:
      'A custom Shopify admin app replacing spreadsheet-based order and inventory management for a multi-location luxury retailer.',
    challenge:
      'The client operated 4 locations with no centralized inventory system. Order routing was manual and error-prone.',
    architecture:
      'Shopify App Bridge for embedded admin UI, custom REST API backend for order routing logic, PostgreSQL for audit logging.',
    results:
      'Eliminated 12 hours/week of manual reconciliation. Zero fulfillment errors in 6 months post-launch.',
    images: ['/projects/maison-studio/01.jpg'],
    featured: true,
  },
  {
    slug: 'vault-archive',
    title: 'Vault Archive',
    subtitle: 'Content Commerce Platform',
    client: 'Vault',
    year: 2023,
    category: 'SHOPIFY PLUS',
    tech: ['Liquid', 'TypeScript', 'Shopify Plus', 'Alpine.js'],
    status: 'ARCHIVED',
    description:
      'A content-forward commerce platform merging editorial long-form with shoppable product integration for a lifestyle brand.',
    challenge:
      'The client wanted article pages to feel editorial but function as high-converting PDPs.',
    architecture:
      'Custom Liquid templating with metafield-driven content, Alpine.js for interactive components, Shopify Scripts for checkout logic.',
    results: '28% increase in editorial-to-purchase conversion.',
    images: ['/projects/vault-archive/01.jpg'],
    featured: false,
  },
  {
    slug: 'neo-brutalist-ui',
    title: 'Neo-Brutalist UI',
    subtitle: 'Design System & Component Library',
    year: 2023,
    category: 'OPEN SOURCE',
    tech: ['React', 'TypeScript', 'Storybook', 'CSS Modules'],
    status: 'ARCHIVED',
    description:
      'An open-source React component library implementing neo-brutalist design principles for commerce-adjacent applications.',
    challenge:
      'Most UI libraries optimize for rounded, friendly aesthetics. This project explored sharp, high-contrast design systems for editorial brands.',
    architecture:
      'Standalone React components with CSS Modules, Storybook for documentation, automated visual regression tests with Percy.',
    results: '400+ GitHub stars. Adopted by 3 client projects.',
    images: ['/projects/neo-brutalist-ui/01.jpg'],
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
