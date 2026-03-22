import { z, defineCollection } from 'astro:content';

const servicesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

const benefitsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

const testimonialsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    quote: z.string(),
    author: z.string(),
  }),
});

const siteCollection = defineCollection({
  type: 'data',
  schema: z.object({}).passthrough(),
});

export const collections = {
  services: servicesCollection,
  benefits: benefitsCollection,
  testimonials: testimonialsCollection,
  site: siteCollection,
};
