/**
 * Location: src/app/api/interview/start/route.ts
 * Create folders: src/app/api/interview/start/
 */
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { startInterviewSession } from "@/lib/database/userquery"
import { StartSessionPayloadSchema } from "@/lib/types/user"
import { NextResponse } from "next/server"

/**
 * POST /api/interview/start
 * Body: { problemId?, problemTitle?, difficulty? }
 * Returns: { sessionId: number }
 *
 * Call this when the user enters the interview page.
 * Store the returned sessionId in React state — you pass it to /complete later.
 */
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = StartSessionPayloadSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { problemId, problemTitle, difficulty } = parsed.data
    const sessionId = await startInterviewSession(
        session.user.id, problemId, problemTitle, difficulty
    )

    return NextResponse.json({ sessionId })
}