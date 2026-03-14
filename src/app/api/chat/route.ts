import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText } from "ai";
import FileUtils from "@/lib/utils/FileUtils";
import { getProblemsByDifficulty } from "@/lib/database/query";
import { promises as fs } from "node:fs"; 
import path from "node:path"; 

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

export async function POST(req: Request) {
	const { messages, currentCode, difficulty, mode } = await req.json();
	const isBehaviouralMode = mode === "behavioural";

	const base_prompt = isBehaviouralMode ? await getBehaviouralPrompt() : await getBasePrompt();
	if (!base_prompt) {
		return new Response("Internal Server Error: No prompt found", { status: 500 });
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
`
		: "";

	const codeSection = !isBehaviouralMode && currentCode ? `\n\n=== LIVE EDITOR STATE ===\n${currentCode}\n` : "";

	const prompt = `${base_prompt}${behavioralSection}${leetcodeSection}${codeSection}`;

	const result = streamText({
		model: groq("llama-3.3-70b-versatile"),
		system: prompt,
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
}

const getTimeoutPrompt = async (): Promise<string | null> => {
    if (cached_timeout_prompt) return cached_timeout_prompt;
    try {
        const file_path = path.join(process.cwd(), 'src', 'lib', 'data', 'timeout.txt');
        cached_timeout_prompt = await fs.readFile(file_path, 'utf8');
        return cached_timeout_prompt;
    } catch (e) { return null; }
}

export async function POST(req: Request) {
    const { messages, currentCode, isTimeout, difficulty = "Medium" } = await req.json();

    let systemInstruction: string;

    if (isTimeout) {
        console.log("Timeout Mode Activated.");
        const timeoutPrompt = await getTimeoutPrompt();
        systemInstruction = timeoutPrompt ?? "Interview over. Summarize performance.";
    } else {
        const base_prompt = await getBasePrompt();
        if (!base_prompt) return new Response("Prompt not found", { status: 500 });

        // Only pick new questions if this is the START of the interview
        // Otherwise, the questions will change every time the user sends a message!
        const isNewStart = !messages || messages.length === 0;
        
        const behavioral = isNewStart ? pickRandom(await getBehavioralQuestions()) : null;
        const leetcode = isNewStart ? await getRandomLeetCodeQuestion(difficulty) : null;

        const behavioralSection = behavioral ? `\n\n=== BEHAVIORAL ===\n${behavioral}` : "";
        const leetcodeSection = leetcode ? `\n\n=== LEETCODE ===\n${leetcode.title}\n${leetcode.description}` : "";
        const codeSection = currentCode ? `\n\n=== LIVE CODE ===\n${currentCode}` : "";

        systemInstruction = `${base_prompt}${behavioralSection}${leetcodeSection}${codeSection}`;
    }

    const result = streamText({
        model: groq('llama-3.3-70b-versatile'),
        system: systemInstruction,
        messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}