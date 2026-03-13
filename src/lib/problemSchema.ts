import { z } from 'zod';

export const ProblemSchema = z.object({
  difficulty: z.string(),
  frontendQuestionId: z.string(),
  paidOnly: z.boolean(), // keep boolean
  title: z.string(),
  titleSlug: z.string(),
  url: z.string(),
  description_url: z.string(),
  description: z.string(),
  solution: z.string().nullable().optional(), 
  solution_code_python: z.string().nullable().optional(),
  solution_code_java: z.string().nullable().optional(),
  solution_code_cpp: z.string().nullable().optional(),
  solution_code_url: z.string().nullable().optional(),
  category: z.string(),
  acceptance_rate: z.number(),
  topics: z.string(),
  hints: z.string(),
  similar_questions: z.string(),
  stats: z.string()
});

// Type for TypeScript
export type Problem = z.infer<typeof ProblemSchema>;