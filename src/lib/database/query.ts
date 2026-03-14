'use server'

import {LeetcodeQuestion, LeetcodeSchema} from "@/lib/types/leetcode";
import {loadDB} from "@/lib/database/init";

/**
 * Fetches problems from the database matching a specific difficulty.
 * @param difficulty - The difficulty level ('Easy', 'Medium', 'Hard')
 * @returns Array of parsed Problem objects
 */
export async function getProblemsByDifficulty(difficulty: "Easy" | "Medium" | "Hard", limit: number = 100): Promise<LeetcodeQuestion[]> {
    // Get the DB connection
    const db = await loadDB();

    // Get all the questions that match the difficulty
    const questions = await db.all(`SELECT * FROM problems WHERE difficulty = ? ORDER BY RANDOM() LIMIT ?`, difficulty, limit);

    // Parse the questions to the ZOD schema
    return questions.map(row => {
        // Convert the paid only number (0 or 1) to a boolean data type
        row = {
            ...row,
            paidOnly: row.paidOnly === 1
        }

        // Parse the row into a leetcode question type
        const question = LeetcodeSchema.parse(row)

        // Map the question
        return {
            ...question,
            topics: question.topics ? JSON.parse(question.topics) : [],
            hints: question.hints ? JSON.parse(question.hints) : [],
            similar_questions: question.similar_questions ? JSON.parse(question.similar_questions) : [],
            stats: question.stats ? JSON.parse(question.stats) : {}
        };
    });
}