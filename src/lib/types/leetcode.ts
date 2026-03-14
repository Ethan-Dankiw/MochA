import { z } from 'zod';

export const LeetcodeSchema = z.object({
  difficulty: z.string(),
  frontendQuestionId: z.string(),
  paidOnly: z.boolean(), // keep boolean
  title: z.string(),
  titleSlug: z.string(),
  url: z.string(),
  description_url: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  solution: z.string().nullable().optional(), 
  solution_code_python: z.string().nullable().optional(),
  solution_code_java: z.string().nullable().optional(),
  solution_code_cpp: z.string().nullable().optional(),
  solution_code_url: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  acceptance_rate: z.number().nullable().optional(),
  topics: z.string(),
  hints: z.string(),
  similar_questions: z.string(),
  stats: z.string()
});

// Type for TypeScript
export type LeetcodeQuestion = z.infer<typeof LeetcodeSchema>;