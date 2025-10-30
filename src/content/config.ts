import { defineCollection, z } from 'astro:content';

const submissionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    vibe: z.string(),
    author: z.string(),
    authorUrl: z.string().url().optional(),
    repository: z.string().url().optional(),
    liveSite: z.string().url().optional(),
    image: z.string().optional(),
    date: z.coerce.date(),
  }),
});

export const collections = {
  submissions: submissionsCollection,
};
