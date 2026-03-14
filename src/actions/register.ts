"use server"

import {RegisterPayloadSchema} from "@/lib/types/user";
import {createEmailUser, getUserByEmail} from "@/lib/database/userquery";
import bcrypt from "bcryptjs";
import {createSession} from "@/lib/session/session";


export async function registerUser(
    email: string,
    name: string,
    password: string
): Promise<{ success: boolean; message: string; userId?: string }> {

    // Validate input shape first
    const parsed = RegisterPayloadSchema.safeParse({ email, name, password });
    if (!parsed.success) {
        return { success: false, message: parsed.error.issues[0].message };
    }

    const normalizedEmail = parsed.data.email.toLowerCase().trim();

    // Check the email isn't already registered
    const existing = await getUserByEmail(normalizedEmail);
    if (existing) {
        return { success: false, message: "An account with this email already exists." };
    }

    // Hash the password — saltRounds=12 is the industry standard
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    const user = await createEmailUser(normalizedEmail, parsed.data.name, passwordHash);

    await createSession(user.id)

    return { success: true, message: "Account created!", userId: user.id };
}