import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const topicSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  readTime: z.string(),
  diagram: z.string(),
  relatedTopics: z.array(z.string()).default([]),
  isCaseStudy: z.boolean().default(false),
  takeaways: z.array(z.string()).optional(),
  interviewTips: z.array(z.string()).optional(),
  problemStatement: z.string().optional(),
  quiz: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        answer: z.number(),
        explanation: z.string(),
      })
    )
    .optional(),
});

export const collections = {
  fundamentals: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/fundamentals' }),
    schema: topicSchema,
  }),
  'building-blocks': defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/building-blocks' }),
    schema: topicSchema,
  }),
  patterns: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/patterns' }),
    schema: topicSchema,
  }),
  'case-studies': defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/case-studies' }),
    schema: topicSchema,
  }),
  'interview-prep': defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/interview-prep' }),
    schema: topicSchema,
  }),
};
