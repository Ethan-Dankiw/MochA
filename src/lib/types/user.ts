import { z } from "zod";

// ─── users table ──────────────────────────────────────────────────────────────

export const UserSchema = z.object({
    id:            z.string(),
    email:         z.string().email(),
    name:          z.string().nullable(),
    image:         z.string().nullable(),
    password_hash: z.string().nullable(),   // null for Google OAuth users
    provider:      z.enum(["email", "google"]),
    created_at:    z.string(),
});

export type User = z.infer<typeof UserSchema>;

// Strip password_hash before sending anything to the frontend
export const PublicUserSchema = UserSchema.omit({ password_hash: true });
export type PublicUser = z.infer<typeof PublicUserSchema>;

// ─── interview_sessions table ─────────────────────────────────────────────────

export const InterviewSessionSchema = z.object({
    id:                     z.number(),
    user_id:                z.string(),
    problem_id:             z.number().nullable(),
    problem_title:          z.string().nullable(),
    difficulty:             z.string().nullable(),
    started_at:             z.string(),
    completed_at:           z.string().nullable(),
    behavioural_score:      z.number().nullable(),
    confirm_question_score: z.number().nullable(),
    algorithm_score:        z.number().nullable(),
    complexity_score:       z.number().nullable(),
    coding_score:           z.number().nullable(),
    testing_score:          z.number().nullable(),
    // SQLite stores booleans as 0/1 — coerce to real boolean
    passed: z.union([z.boolean(), z.number()])
             .transform(v => v === true || v === 1),
});

export type InterviewSession = z.infer<typeof InterviewSessionSchema>;

// ─── topic_attempts table ─────────────────────────────────────────────────────

export const TopicAttemptSchema = z.object({
    id:            z.number(),
    user_id:       z.string(),
    topic:         z.string(),
    problem_id:    z.number().nullable(),
    problem_title: z.string().nullable(),
    difficulty:    z.string().nullable(),
    solved: z.union([z.boolean(), z.number()])
             .transform(v => v === true || v === 1),
    attempted_at:  z.string(),
});

export type TopicAttempt = z.infer<typeof TopicAttemptSchema>;

// ─── Computed/aggregated types ────────────────────────────────────────────────

export const TopicProgressSchema = z.object({
    topic:          z.string(),
    total_attempts: z.number(),
    solved:         z.number(),
    last_attempted: z.string(),
    // One entry per calendar day — used for progression charts
    history: z.array(z.object({
        date:   z.string(),  // "YYYY-MM-DD"
        solved: z.number(),
    })),
});

export type TopicProgress = z.infer<typeof TopicProgressSchema>;

export const UserProgressSchema = z.object({
    user:                   PublicUserSchema,
    total_interviews:       z.number(),
    interviews_passed:      z.number(),
    total_topics_practiced: z.number(),
    topics:                 z.array(TopicProgressSchema),
    recent_sessions:        z.array(InterviewSessionSchema),
});

export type UserProgress = z.infer<typeof UserProgressSchema>;

// ─── API payload schemas ──────────────────────────────────────────────────────

export const StartSessionPayloadSchema = z.object({
    problemId:    z.number().nullable().default(null),
    problemTitle: z.string().nullable().default(null),
    difficulty:   z.string().nullable().default(null),
});

export const CompleteSessionPayloadSchema = z.object({
    sessionId:              z.number(),
    behavioural_score:      z.number().min(0).max(10),
    confirm_question_score: z.number().min(0).max(10),
    algorithm_score:        z.number().min(0).max(10),
    complexity_score:       z.number().min(0).max(10),
    coding_score:           z.number().min(0).max(10),
    testing_score:          z.number().min(0).max(10),
    topics:                 z.array(z.string()),
    problemId:              z.number().nullable().default(null),
    problemTitle:           z.string().nullable().default(null),
    difficulty:             z.string().nullable().default(null),
});

export type CompleteSessionPayload = z.infer<typeof CompleteSessionPayloadSchema>;

// ─── Auth payload schemas ─────────────────────────────────────────────────────

export const LoginPayloadSchema = z.object({
    email:    z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const RegisterPayloadSchema = z.object({
    email:    z.string().email("Invalid email address"),
    name:     z.string().min(1, "Name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});