/**
 * Location: src/app/api/interview/start/route.ts
 * Create folders: src/app/api/interview/start/
 */
import {startInterviewSession} from "@/lib/database/userquery"
import {StartSessionPayloadSchema} from "@/lib/types/user"
import {NextResponse} from "next/server"
import {getSessionPayload} from "@/lib/session/session";


/**
 * POST /api/interview/start
 * Body: { problemId?, problemTitle?, difficulty? }
 * Returns: { sessionId: number }
 *
 * Call this when the user enters the interview page.
 * Store the returned sessionId in React state — you pass it to /complete later.
 */
export async function POST(req: Request) {
    // Get session payload
    const payload = await getSessionPayload()

    // If the session payload does not exist or is for an unauthenticated user
    if (!payload?.authenticated || !payload?.user_id) {
        return NextResponse.json({error: "Unauthorised"}, {status: 401})
    }

    const body = await req.json()
    const parsed = StartSessionPayloadSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({error: parsed.error.issues[0].message}, {status: 400})
    }

    const {problemId, problemTitle, difficulty} = parsed.data
    const sessionId = await startInterviewSession(
        payload.user_id, problemId, problemTitle, difficulty
    )

    return NextResponse.json({sessionId})
}