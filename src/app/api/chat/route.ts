import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText } from "ai";
import FileUtils from "@/lib/utils/FileUtils";
import { getProblemsByDifficulty } from "@/lib/database/query";
import { promises as fs } from "node:fs"; 
import path from "node:path";
import {cached} from "sqlite3";

export const maxDuration = 20;

// Define the base prompt that is sent to initialise the AI with instructions on how to act
let cached_prompt: string | null = null;
let cached_behavioural_prompt: string | null = null;
let cached_behavioral_questions: string[] | null = null;
type Difficulty = "Easy" | "Medium" | "Hard";

const pickRandom = <T>(items: T[]): T | null => (items.length ? items[Math.floor(Math.random() * items.length)] : null);

const getBehavioralQuestions = async (): Promise<string[]> => {
    if (cached_behavioral_questions) return cached_behavioral_questions;
    const pathUrl = FileUtils.buildRelativePath("src", "lib", "data", "behavioral_questions.json");
    const raw = await FileUtils.readFile(pathUrl);
    if (!raw) return (cached_behavioral_questions = []);
    try {
        const parsed = JSON.parse(raw);
        cached_behavioral_questions = Array.isArray(parsed) ? parsed : [];
    } catch {
        cached_behavioral_questions = [];
    }
    return cached_behavioral_questions;
};

const getRandomLeetCodeQuestion = async (difficulty: string = "Medium") => {
    try {
        const rows = await getProblemsByDifficulty(difficulty as any, 1);
        return rows[0] ?? null;
    } catch {
        return null;
    }
};

const normalizeDifficulty = (difficulty: unknown): Difficulty => {
	if (typeof difficulty !== "string") {
		return "Medium";
	}

	const normalized = difficulty.trim().toLowerCase();
	if (normalized === "easy") return "Easy";
	if (normalized === "hard") return "Hard";
	if (normalized === "medium") return "Medium";
	return "Medium";
};

const getBehaviouralPrompt = async (): Promise<string | null> => {
	if (cached_behavioural_prompt) {
		return cached_behavioural_prompt;
	}

	const behavioural_prompt_path = FileUtils.buildRelativePath("src", "lib", "data", "behavioural.txt");
	cached_behavioural_prompt = await FileUtils.readFile(behavioural_prompt_path);

	if (!cached_behavioural_prompt) {
		console.error("Failed to read behavioural.txt");
		return null;
	}

	return cached_behavioural_prompt;
};

/**
 * Get the contents of the AI's prompt from disk
 */
const getBasePrompt = async (): Promise<string | null> => {
	// If the prompt has already been cached
	if (cached_prompt) {
		return cached_prompt;
	}

	// Build the file path to the prompt file
	const prompt_file_path = FileUtils.buildRelativePath("src", "lib", "data", "prompt.txt");

	// Get the file from disk
	cached_prompt = await FileUtils.readFile(prompt_file_path);

	// If no file contents exists
	if (!cached_prompt) {
		console.error("Failed to read prompt.txt");
		return null;
	}

	// Return the prompt
	return cached_prompt;
};

let cachedPrompt: string | null = null;

const MODEL = "llama-3.1-8b-instant";

export async function POST(req: Request) {
	const {messages, currentCode, difficulty, mode, language} = await req.json();

	const isBehaviouralMode = mode === "behavioural";

	const codeSection = !isBehaviouralMode && currentCode ? `\n\n=== LIVE EDITOR STATE for ${language}===\n${currentCode}\n` : "";

	if (cachedPrompt) {
		const prompt = `${cachedPrompt}${codeSection}`;
		console.log(prompt)
		const result = streamText({
			model: groq(MODEL),
			system: prompt,
			maxOutputTokens: 1000,
			messages: await convertToModelMessages(messages),
		});

		return result.toUIMessageStreamResponse();
	}

	const base_prompt = isBehaviouralMode ? await getBehaviouralPrompt() : await getBasePrompt();
	if (!base_prompt) {
		return new Response("Internal Server Error: No prompt found", {status: 500});
	}

	const behavioral = isBehaviouralMode ? null : pickRandom(await getBehavioralQuestions());
	const leetcodeDifficulty = normalizeDifficulty(difficulty);
	const leetcode = isBehaviouralMode ? null : await getRandomLeetCodeQuestion(leetcodeDifficulty);

	const behavioralSection = behavioral ? `\n\n=== BEHAVIORAL QUESTION ===\n${behavioral}\n` : "";

	const leetcodeSection = leetcode
		? `\n\n=== LEETCODE QUESTION ===
Title: ${leetcode.title}
Difficulty: ${leetcode.difficulty}
URL: ${leetcode.url}
Description:
${leetcode.description ?? "No description available."}
` : "";

	cachedPrompt = `${base_prompt}${behavioralSection}${leetcodeSection}`;

	const prompt = `${cachedPrompt}${codeSection}`;
	console.log(prompt)
	const result = streamText({
		model: groq(MODEL),
		system: prompt,
		maxOutputTokens: 1000,
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
}