"use server"

/**
 * userQuery.ts
 *
 * DAO for all user-related tables: users, interview_sessions, topic_attempts.
 * Follows the same pattern as query.ts:
 *   - Call loadDB() for the shared cached connection
 *   - Validate every DB row with the matching Zod schema
 *   - Return typed data — callers never touch raw SQL rows
 */

import { loadDB } from "@/lib/database/init";
import { randomUUID } from "crypto";
import {
    UserSchema,
    PublicUserSchema,
    InterviewSessionSchema,
    TopicAttemptSchema,
    TopicProgressSchema,
    UserProgressSchema,
    type User,
    type PublicUser,
    type InterviewSession,
    type TopicAttempt,
    type TopicProgress,
    type UserProgress,
    type CompleteSessionPayload,
} from "@/lib/types/user";
import {UuidUtils} from "@/lib/utils/UuidUtils";

// ─── Users ────────────────────────────────────────────────────────────────────

/**
 * Look up a user by email.
 * Used by handlelogin.ts to verify credentials.
 * Returns null if not found — callers decide what to do with null.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
    const db = await loadDB();
    const row = await db.get("SELECT * FROM users WHERE email = ?", email);
    if (!row) return null;
    return UserSchema.parse(row);
}

/**
 * Look up a user by their ID.
 * Used server-side after reading userId from the JWT session cookie.
 */
export async function getUserById(id: string): Promise<User | null> {
    const db = await loadDB();
    const row = await db.get("SELECT * FROM users WHERE id = ?", id);
    if (!row) return null;
    return UserSchema.parse(row);
}

/**
 * Create a new email/password account.
 * passwordHash MUST already be bcrypt-hashed — never pass plaintext here.
 * Returns the public user (no password_hash field).
 */
export async function createEmailUser(
    email: string,
    name: string,
    passwordHash: string
): Promise<PublicUser> {
    const db = await loadDB();
    const id = UuidUtils.generate();

    await db.run(
        `INSERT INTO users (id, email, name, password_hash, provider)
         VALUES (?, ?, ?, ?, 'email')`,
        id, email, name, passwordHash
    );

    const row = await db.get("SELECT * FROM users WHERE id = ?", id);
    return PublicUserSchema.parse(UserSchema.parse(row));
}

/**
 * Upsert a Google OAuth user.
 * Called from the NextAuth signIn() callback on every Google login.
 * ON CONFLICT updates name/image in case the user changed them on Google.
 */
export async function upsertGoogleUser(user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
}): Promise<void> {
    const db = await loadDB();
    await db.run(
        `INSERT INTO users (id, email, name, image, provider)
         VALUES (?, ?, ?, ?, 'google')
         ON CONFLICT(id) DO UPDATE SET
             email = excluded.email,
             name  = excluded.name,
             image = excluded.image`,
        user.id, user.email, user.name, user.image
    );
}

// ─── Interview sessions ───────────────────────────────────────────────────────

/**
 * Open a new interview session when the user enters the interview page.
 * Returns the auto-incremented session ID — store this in React state
 * and pass it to completeInterviewSession() when scoring is done.
 */
export async function startInterviewSession(
    userId: string,
    problemId: number | null,
    problemTitle: string | null,
    difficulty: string | null
): Promise<number> {
    const db = await loadDB();
    const result = await db.run(
        `INSERT INTO interview_sessions (user_id, problem_id, problem_title, difficulty)
         VALUES (?, ?, ?, ?)`,
        userId, problemId, problemTitle, difficulty
    );
    return result.lastID!;
}

/**
 * Save scores when the AI finishes scoring the interview.
 *
 * Also inserts one topic_attempts row per topic tag on the problem.
 * Each row carries its own attempted_at timestamp — this is how we track
 * per-topic progression over time (e.g. is the user improving at "Dynamic Programming"?).
 *
 * Pass/fail rule: every single score must be >= 5. One score below 5 = fail.
 */
export async function completeInterviewSession(
    payload: CompleteSessionPayload & { userId: string }
): Promise<void> {
    const {
        sessionId, userId,
        behavioural_score, confirm_question_score,
        algorithm_score, complexity_score,
        coding_score, testing_score,
        topics, problemId, problemTitle, difficulty,
    } = payload;

    const allScores = [
        behavioural_score, confirm_question_score,
        algorithm_score, complexity_score,
        coding_score, testing_score,
    ];
    const passed = allScores.every(s => s >= 5) ? 1 : 0;

    const db = await loadDB();

    await db.run(
        `UPDATE interview_sessions SET
            completed_at           = CURRENT_TIMESTAMP,
            behavioural_score      = ?,
            confirm_question_score = ?,
            algorithm_score        = ?,
            complexity_score       = ?,
            coding_score           = ?,
            testing_score          = ?,
            passed                 = ?
         WHERE id = ?`,
        behavioural_score, confirm_question_score,
        algorithm_score, complexity_score,
        coding_score, testing_score,
        passed, sessionId
    );

    // One row per topic — timestamps accumulate into a progression history
    for (const topic of topics) {
        await db.run(
            `INSERT INTO topic_attempts
                 (user_id, topic, problem_id, problem_title, difficulty, solved)
             VALUES (?, ?, ?, ?, ?, ?)`,
            userId, topic, problemId, problemTitle, difficulty, passed
        );
    }
}

/**
 * Get a single session by ID.
 * Returns null if not found.
 */
export async function getInterviewSession(
    sessionId: number
): Promise<InterviewSession | null> {
    const db = await loadDB();
    const row = await db.get(
        "SELECT * FROM interview_sessions WHERE id = ?",
        sessionId
    );
    if (!row) return null;
    return InterviewSessionSchema.parse(row);
}

// ─── Topic attempts ───────────────────────────────────────────────────────────

/**
 * Get all raw topic attempt rows for a user, most recent first.
 * Useful for rendering a detailed history log.
 */
export async function getTopicAttempts(userId: string): Promise<TopicAttempt[]> {
    const db = await loadDB();
    const rows = await db.all(
        `SELECT * FROM topic_attempts
         WHERE  user_id = ?
         ORDER  BY attempted_at DESC`,
        userId
    );
    return rows.map(row => TopicAttemptSchema.parse(row));
}

// ─── Profile / progress ───────────────────────────────────────────────────────

/**
 * Fetch everything needed for the /profile page in one call:
 *   - User info (password_hash is stripped before returning)
 *   - Interview totals and pass count
 *   - Per-topic aggregates with per-day history for progression charts
 *   - 5 most recent completed sessions with all 6 scores
 *
 * Every value is validated through Zod before being returned.
 * Returns null if the user ID doesn't exist.
 */
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
    const db = await loadDB();

    const userRow = await db.get("SELECT * FROM users WHERE id = ?", userId);
    if (!userRow) return null;

    // Strip password_hash using the PublicUser schema
    const user = PublicUserSchema.parse(UserSchema.parse(userRow));

    // Interview totals
    const countsRow = await db.get(
        `SELECT COUNT(*)    AS total,
                SUM(passed) AS passed
         FROM   interview_sessions
         WHERE  user_id = ? AND completed_at IS NOT NULL`,
        userId
    );
    const total_interviews  = countsRow?.total  ?? 0;
    const interviews_passed = countsRow?.passed ?? 0;

    // Per-topic aggregates
    const topicRows = await db.all(
        `SELECT   topic,
                  COUNT(*)          AS total_attempts,
                  SUM(solved)       AS solved,
                  MAX(attempted_at) AS last_attempted
         FROM     topic_attempts
         WHERE    user_id = ?
         GROUP BY topic
         ORDER BY last_attempted DESC`,
        userId
    );

    // Per-topic daily history (each row = one calendar day)
    const topics: TopicProgress[] = await Promise.all(
        topicRows.map(async (row) => {
            const historyRows = await db.all(
                `SELECT DATE(attempted_at) AS date,
                        SUM(solved)        AS solved
                 FROM   topic_attempts
                 WHERE  user_id = ? AND topic = ?
                 GROUP  BY DATE(attempted_at)
                 ORDER  BY date ASC`,
                userId, row.topic
            );
            return TopicProgressSchema.parse({ ...row, history: historyRows });
        })
    );

    // 5 most recent completed sessions
    const sessionRows = await db.all(
        `SELECT * FROM interview_sessions
         WHERE  user_id = ? AND completed_at IS NOT NULL
         ORDER  BY completed_at DESC
         LIMIT  5`,
        userId
    );
    const recent_sessions = sessionRows.map(row => InterviewSessionSchema.parse(row));

    return UserProgressSchema.parse({
        user,
        total_interviews,
        interviews_passed,
        total_topics_practiced: topicRows.length,
        topics,
        recent_sessions,
    });
}