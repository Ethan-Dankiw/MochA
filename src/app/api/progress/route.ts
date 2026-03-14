/**
 * Location: src/app/api/progress/route.ts
 * Create folder: src/app/api/progress/
 */
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUserProgress } from "@/lib/database/userquery"
import { NextResponse } from "next/server"

/**
 * GET /api/progress
 *
 * Returns UserProgress for the logged-in user:
 *   - Public user info (password_hash is never included)
 *   - Total interviews and how many passed
 *   - Per-topic aggregates with daily history for progression charts
 *   - 5 most recent completed sessions with all 6 scores
 */
export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const progress = await getUserProgress(session.user.id)
    if (!progress) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(progress)
}