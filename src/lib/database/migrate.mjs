'use server'

/**
 * migrate.mjs — adds user tables to leetcode.sqlite.
 * Plain Node.js — no ts-node, no path alias issues.
 *
 * Run once from the project root:
 *   node src/lib/database/migrate.mjs
 *
 * Safe to re-run — all statements use CREATE TABLE IF NOT EXISTS.
 */
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "data", "leetcode.sqlite");

async function migrate() {
    console.log("📂 Opening:", DB_PATH);
    const db = await open({ filename: DB_PATH, driver: sqlite3.Database });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id            TEXT PRIMARY KEY,
            email         TEXT UNIQUE NOT NULL,
            name          TEXT,
            image         TEXT,
            password_hash TEXT,
            provider      TEXT NOT NULL DEFAULT 'email',
            created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS interview_sessions (
            id                     INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id                TEXT    NOT NULL,
            problem_id             INTEGER,
            problem_title          TEXT,
            difficulty             TEXT,
            started_at             DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at           DATETIME,
            behavioural_score      INTEGER,
            confirm_question_score INTEGER,
            algorithm_score        INTEGER,
            complexity_score       INTEGER,
            coding_score           INTEGER,
            testing_score          INTEGER,
            passed                 INTEGER DEFAULT 0,
            FOREIGN KEY (user_id)    REFERENCES users(id),
            FOREIGN KEY (problem_id) REFERENCES problems(id)
        );

        CREATE TABLE IF NOT EXISTS topic_attempts (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id       TEXT    NOT NULL,
            topic         TEXT    NOT NULL,
            problem_id    INTEGER,
            problem_title TEXT,
            difficulty    TEXT,
            solved        INTEGER DEFAULT 0,
            attempted_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id)    REFERENCES users(id),
            FOREIGN KEY (problem_id) REFERENCES problems(id)
        );

        CREATE INDEX IF NOT EXISTS idx_sessions_user  ON interview_sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_attempts_user  ON topic_attempts(user_id);
        CREATE INDEX IF NOT EXISTS idx_attempts_topic ON topic_attempts(user_id, topic);
    `);

    console.log("✅ Done — users, interview_sessions, topic_attempts created in leetcode.sqlite");
    await db.close();
}

migrate().catch(err => {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
});