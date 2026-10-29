import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { normalizeTags } from './lib/terms';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z
    .object({
      type: z.enum(['life', 'tech', 'note']),
      title: z.string().optional(),
      description: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: z.string().optional(),
      series: z.string().optional(),
      tags: z.array(z.string()).default([]).transform(normalizeTags),
      draft: z.boolean().default(false),
      presentation: z.enum(['composed']).optional(),
      coverImage: z.strictObject({ src: image(), alt: z.string() }).optional(),
      toc: z.boolean().default(true),
    })
    .refine((post) => post.type === 'note' || Boolean(post.title), {
      message: 'Life 和 Tech 文章必须提供 title。',
      path: ['title'],
    })
    .refine((post) => !post.presentation || post.type === 'tech', {
      message: '组合式展示只适用于 Tech 文章。',
      path: ['presentation'],
    }),
});

const labs = defineCollection({
  loader: glob({ base: './src/content/labs', pattern: '*/index.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    status: z.enum(['finished', 'experiment']).default('finished'),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, labs };
