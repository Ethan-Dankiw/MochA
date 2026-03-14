import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText } from "ai";
import FileUtils from "@/lib/utils/FileUtils";
import { getProblemsByDifficulty } from "@/lib/database/query";

export const maxDuration = 20;

// Define the base prompt that is sent to initialise the AI with instructions on how to act
let cached_prompt: string | null = null;
let cached_behavioral_questions: string[] | null = null;

const pickRandom = <T>(items: T[]): T | null => (items.length ? items[Math.floor(Math.random() * items.length)] : null);

//get  the behavioural
const getBehavioralQuestions = async (): Promise<string[]> => {
	if (cached_behavioral_questions) return cached_behavioral_questions;

	const path = FileUtils.buildRelativePath("src", "lib", "data", "behavioral_questions.json");
	const raw = await FileUtils.readFile(path);

	if (!raw) return (cached_behavioral_questions = []);

	try {
		const parsed = JSON.parse(raw);
		cached_behavioral_questions = Array.isArray(parsed) ? parsed.filter((q): q is string => typeof q === "string" && q.trim().length > 0) : [];
	} catch {
		cached_behavioral_questions = [];
	}

	return cached_behavioral_questions;
};

const getRandomLeetCodeQuestion = async (difficulty: "Easy" | "Medium" | "Hard" = "Medium") => {
	try {
		const rows = await getProblemsByDifficulty(difficulty, 1); // SQL already random
		return rows[0] ?? null;
	} catch {
		return null;
	}
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
	const { messages, currentCode, difficulty } = await req.json();

	const base_prompt = await getBasePrompt();
	if (!base_prompt) {
		return new Response("Internal Server Error: No base prompt found", { status: 500 });
	}

	const behavioral = pickRandom(await getBehavioralQuestions());
	const leetcode = await getRandomLeetCodeQuestion(difficulty === "Easy" || difficulty === "Hard" ? difficulty : "Medium");

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

	const codeSection = currentCode ? `\n\n=== LIVE EDITOR STATE ===\n${currentCode}\n` : "";

	const prompt = `${base_prompt}${behavioralSection}${leetcodeSection}${codeSection}`;

	const result = streamText({
		model: groq("llama-3.3-70b-versatile"),
		system: prompt,
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
}

// export async function POST(req: Request) {
//     // Fetch the message and current code from the request
//     const {messages, currentCode} = await req.json();

//     // Get the base prompt for the AI
//     const base_prompt = await getBasePrompt();

//     // If the base prompt does not exist
//     if (!base_prompt) {
//         console.warn("No base prompt for the AI")
//         return new Response("Internal Server Error: No base prompt found", { status: 500 });
//     }

//     // Dynamically append the contents of the user's code editor in the prompt
//     const prompt = currentCode
//         ? `${base_prompt}\n\n=== LIVE EDITOR STATE ===\nThe candidate is currently writing the following code in their editor. Use this to understand their context and answer their queries:\n${base_prompt}\n`
//         : base_prompt

//     const result = streamText({
//         model: groq('llama-3.3-70b-versatile'),
//         system: prompt,
//         messages: await convertToModelMessages(messages),
//     });

//     return result.toUIMessageStreamResponse();
// }
