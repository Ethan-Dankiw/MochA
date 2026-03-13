import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Open DB
  const db = await open({
    filename: path.join(__dirname, 'leetcode.db'),
    driver: sqlite3.Database
  });

  // Drop table if exists (to avoid schema conflicts)
  await db.exec(`DROP TABLE IF EXISTS problems`);

  // Create table with paidOnly column
  await db.exec(`
    CREATE TABLE IF NOT EXISTS problems (
      id INTEGER PRIMARY KEY,
      frontendQuestionId TEXT,
      title TEXT,
      titleSlug TEXT,
      difficulty TEXT,
      url TEXT,
      description_url TEXT,
      description TEXT,
      solution_url TEXT,
      solution TEXT,
      solution_code_python TEXT,
      solution_code_java TEXT,
      solution_code_cpp TEXT,
      category TEXT,
      acceptance_rate REAL,
      paidOnly INTEGER,
      topics TEXT,
      hints TEXT,
      likes INTEGER,
      dislikes INTEGER,
      similar_questions TEXT,
      stats TEXT
    )
  `);

  // Read JSON
  const filePath = path.join(__dirname, 'data', 'leetcode_problems.json');
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const insert = `
    INSERT INTO problems (
      frontendQuestionId, title, titleSlug, difficulty, url, description_url,
      description, solution_url, solution, solution_code_python, solution_code_java,
      solution_code_cpp, category, acceptance_rate, paidOnly, topics, hints, likes, dislikes,
      similar_questions, stats
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const p of jsonData) {
    await db.run(insert,
      p.frontendQuestionId,
      p.title,
      p.titleSlug,
      p.difficulty,
      p.url,
      p.description_url,
      p.description,
      p.solution_url,
      p.solution,
      p.solution_code_python,
      p.solution_code_java,
      p.solution_code_cpp,
      p.category,
      p.acceptance_rate,
      p.paidOnly ? 1 : 0,  // convert boolean to 0/1
      JSON.stringify(p.topics || []),
      JSON.stringify(p.hints || []),
      p.likes || 0,
      p.dislikes || 0,
      JSON.stringify(p.similar_questions || []),
      JSON.stringify(p.stats || {})
    );
  }

  console.log('Database populated!');
  await db.close();
}

main();