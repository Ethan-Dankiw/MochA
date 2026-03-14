/**
 * Location: src/app/api/interview/complete/route.ts
 * Create folders: src/app/api/interview/complete/
 */
import {completeInterviewSession} from "@/lib/database/userquery"
import {CompleteSessionPayloadSchema} from "@/lib/types/user"
import {NextResponse} from "next/server"
import {getSessionPayload} from "@/lib/session/session";


/**
 * POST /api/interview/complete
 * Body: {
 *   sessionId,
 *   behavioural_score, confirm_question_score, algorithm_score,
 *   complexity_score, coding_score, testing_score,   (all 0–10)
 *   topics: string[],     e.g. ["Array", "Hash Table"]
 *   problemId?, problemTitle?, difficulty?
 * }
 *
 * Saves scores, marks pass/fail, and inserts one topic_attempts row per topic.
 * Those rows are what build the per-topic progression history over time.
 */
export async function POST(req: Request) {
    // Get session payload
    const payload = await getSessionPayload()

    // If the session payload does not exist or is for an unauthenticated user
    if (!payload?.authenticated || !payload?.user_id) {
        return NextResponse.json({error: "Unauthorised"}, {status: 401})
    }

    const body = await req.json()
    const parsed = CompleteSessionPayloadSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({error: parsed.error.issues[0].message}, {status: 400})
    }

    await completeInterviewSession({
        ...parsed.data,
        userId: payload.user_id,
    })

    return NextResponse.json({ok: true})
}