import { registerUser } from "@/lib/handlelogin"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { email, name, password } = await req.json()
    const result = await registerUser(email, name, password)
    return NextResponse.json(result)
}