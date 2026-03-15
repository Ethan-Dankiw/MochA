"use server"

import {UuidUtils} from "@/lib/utils/UuidUtils";
import {SessionPayload} from "@/lib/types/session";
import {decryptPayload, encryptPayload} from "@/lib/session/jose";
import {deleteCookie, fetchCookie, storeCookie} from "@/lib/session/cookie";

// 1 day = 86400000 ms
const MS_PER_DAY = 86400000;

// Define the name of the session
const SESSION_NAME = 'mocha-session'

export async function getSessionPayload() {
    // Get the session cookie
    const session = await fetchCookie(SESSION_NAME);

    // If the session does not exist
    if (!session) {
        // Create a new un-authenticated session
        await createSession();

        // Get the session payload for the new session
        return getSessionPayload();
    }

    // Get the session token from the cookie
    const token = session.value

    // Decrypt the session payload
    return await decryptPayload(token);
}

export async function createSession(user_id?: string) {
    // Create a session payload
    const payload: SessionPayload = {
        authenticated: !!user_id,
        user_id: user_id || UuidUtils.generate()
    }

    // Encrypt the session
    const session = await encryptPayload(payload);

    // If the session token does not exist
    if (!session) {
        console.error("Could not create session");
        return;
    }

    // Save the session token
    await saveSession(session);
}

export async function destroySession() {
    // Delete the session cookie
    await deleteCookie(SESSION_NAME);
}

async function saveSession(token: string) {
    // Set an expiry for 7 days in the future
    const expiry = new Date(Date.now() + (7 * MS_PER_DAY));

    // Save the session token in the browser cookie
    await storeCookie(SESSION_NAME, token, expiry);
}