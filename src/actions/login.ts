"use server"

import {LoginPayloadSchema} from "@/lib/types/user";
import {getUserByEmail} from "@/lib/database/userquery";
import bcrypt from "bcryptjs";
import {createSession} from "@/lib/session/session";


export async function loginUser(
    email: string,
    password: string
): Promise<{ success: boolean; message: string; userId?: string }> {

    // Validate input shape first
    const parsed = LoginPayloadSchema.safeParse({email, password});
    if (!parsed.success) {
        return {success: false, message: parsed.error.issues[0].message};
    }

    const normalizedEmail = parsed.data.email.toLowerCase().trim();
    const user = await getUserByEmail(normalizedEmail);

    // Use a generic message — never reveal whether the email exists
    const FAIL = {success: false, message: "Invalid email or password"};

    if (!user) return FAIL;

    // This account was created via Google — it has no password
    if (user.provider === "google") {
        return {
            success: false,
            message: "This account uses Google sign-in. Use the 'Login with Google' button.",
        };
    }

    if (!user.password_hash) return FAIL;

    // bcrypt.compare hashes the plaintext and checks it against the stored hash
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) return FAIL;

    // Create a new session for the logged-in user
    await createSession(user.id)

    return {success: true, message: "Logged in!", userId: user.id};
}