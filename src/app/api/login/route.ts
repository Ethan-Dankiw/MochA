import { loginUser } from "@/lib/handlelogin"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { email, password } = await req.json()
    const result = await loginUser(email, password)
    return NextResponse.json(result)
}