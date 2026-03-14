"use server"

/**
 * handlelogin.ts
 *
 * What was happening before:
 *   A hardcoded check — if email === "test@1" and password === "123" return success.
 *   This is not real auth. It doesn't touch the database at all.
 *
 * What real auth looks like:
 *   LOGIN  → find user by email → bcrypt.compare(plaintext, storedHash) → return result
 *   SIGNUP → validate input → check email not taken → bcrypt.hash(plaintext) → store hash
 *
 * Why bcrypt?
 *   - One-way: you can never decrypt a bcrypt hash, only verify against it
 *   - Salted: auto-generates a random salt per hash, defeating rainbow table attacks
 *   - Slow: saltRounds=12 means 2^12 = 4096 iterations, making brute force impractical
 *   - Self-contained: the stored string includes the salt, so you only store one column
 */

import bcrypt from "bcryptjs";
import { getUserByEmail, createEmailUser } from "@/lib/database/userquery";
import { LoginPayloadSchema, RegisterPayloadSchema } from "@/lib/types/user";

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginUser(
    email: string,
    password: string
): Promise<{ success: boolean; message: string; userId?: string }> {

    // Validate input shape first
    const parsed = LoginPayloadSchema.safeParse({ email, password });
    if (!parsed.success) {
        return { success: false, message: parsed.error.issues[0].message };
    }

    const normalizedEmail = parsed.data.email.toLowerCase().trim();
    const user = await getUserByEmail(normalizedEmail);

    // Use a generic message — never reveal whether the email exists
    const FAIL = { success: false, message: "Invalid email or password" };

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

    return { success: true, message: "Logged in!", userId: user.id };
}

// ─── Register ─────────────────────────────────────────────────────────────────

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

    return { success: true, message: "Account created!", userId: user.id };
}