"use server"

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'node:path';
import { LeetcodeQuestion, LeetcodeSchema } from './types/leetcode';


export async function getLeetcodeDb() {
    const dbPath = path.resolve('./src/db/leetcode.db'); // absolute path
    return open({
        filename: dbPath,
        driver: sqlite3.Database
    });
}

export async function getProblems(limit = 10): Promise<LeetcodeQuestion[]> {
    const db = await getLeetcodeDb();
    const rows = await db.all('SELECT * FROM problems LIMIT ?', limit);
    await db.close();

    return rows.map(row => {
        // Convert paidOnly number (0/1) back to boolean
        const normalizedRow = {
            ...row,
            paidOnly: row.paidOnly === 1
        };

        const validated = LeetcodeSchema.parse(normalizedRow);

        return {
            ...validated,
            topics: validated.topics ? JSON.parse(validated.topics) : [],
            hints: validated.hints ? JSON.parse(validated.hints) : [],
            similar_questions: validated.similar_questions ? JSON.parse(validated.similar_questions) : [],
            stats: validated.stats ? JSON.parse(validated.stats) : {}
        };
    });
}