import {loadDB} from "@/lib/database/init";
import FileUtils from "@/lib/utils/FileUtils";

// Cache the contents of the leetcode JSON questions
let leetcode: any[] | null = null;

const loadLeetcodeQuestions = async () => {
    // If the leetcode questions already exist
    if (leetcode) {
        return leetcode;
    }

    // Build the path to the leetcode problems
    const leetcode_file_path = FileUtils.buildRelativePath('src', 'lib', 'data', 'leetcode_problems.json')

    // Read the contents of the JSON file
    const leetcode_raw = await FileUtils.readFile(leetcode_file_path);

    // If the leetcode questions were not read in
    if (!leetcode_raw) {
        console.error("Failed to read leetcode questions from disk")
        return null;
    }

    // Parse the leetcode questions into JSON
    leetcode = JSON.parse(leetcode_raw) as any[];

    // Return the parsed leetcode questions
    return leetcode;
}

export const populateDB = async () => {
    // Load the leetcode questions from disk
    const questions = await loadLeetcodeQuestions();

    // If the leetcode questions dont exist
    if (!questions) {
        console.error("Failed to load leetcode questions");
        return;
    }

    // Load the DB from the sqlite file
    const db = await loadDB();

    // Drop table if exists (to avoid schema conflicts)
    await db.exec(`DROP TABLE IF EXISTS problems`);

    // Create table with paidOnly column
    await db.exec(`
        CREATE TABLE IF NOT EXISTS problems
        (
            id                   INTEGER PRIMARY KEY AUTOINCREMENT,
            frontendQuestionId   TEXT,
            title                TEXT,
            titleSlug            TEXT,
            difficulty           TEXT,
            url                  TEXT,
            description_url      TEXT,
            description          TEXT,
            solution_url         TEXT,
            solution             TEXT,
            solution_code_python TEXT,
            solution_code_java   TEXT,
            solution_code_cpp    TEXT,
            category             TEXT,
            acceptance_rate      REAL,
            paidOnly             INTEGER,
            topics               TEXT,
            hints                TEXT,
            likes                INTEGER,
            dislikes             INTEGER,
            similar_questions    TEXT,
            stats                TEXT
        )
    `);

    // Start a transaction to make bulk inserts lightning fast
    await db.exec('BEGIN TRANSACTION');

    // Prepare the statement used for the transaction
    const insert = await db.prepare(`
        INSERT INTO problems (frontendQuestionId, title, titleSlug, difficulty, url, description_url,
                              description, solution_url, solution, solution_code_python, solution_code_java,
                              solution_code_cpp, category, acceptance_rate, paidOnly, topics, hints, likes, dislikes,
                              similar_questions, stats)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    // For each of the leetcode questions
    for (const question of questions) {
        await insert.run(
            question.frontendQuestionId,
            question.title,
            question.titleSlug,
            question.difficulty,
            question.url,
            question.description_url,
            question.description,
            question.solution_url,
            question.solution,
            question.solution_code_python,
            question.solution_code_java,
            question.solution_code_cpp,
            question.category,
            question.acceptance_rate,
            question.paidOnly ? 1 : 0,  // convert boolean to 0/1
            JSON.stringify(question.topics || []),
            JSON.stringify(question.hints || []),
            question.likes || 0,
            question.dislikes || 0,
            JSON.stringify(question.similar_questions || []),
            JSON.stringify(question.stats || {})
        );
    }

    // Finalise the transaction
    await insert.finalize();

    // Commit the transaction to the DB
    await db.exec("COMMIT")

    // Close the DB since it has been populated
    await db.close();
}

// Load the problems by populating the database
await populateDB();