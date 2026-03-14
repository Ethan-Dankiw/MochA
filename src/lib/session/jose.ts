import 'server-only'

import {JoseSession, jwtVerify, SignJWT} from "jose";
import {SessionPayload} from "@/lib/types/session";

// Get the session secret from .env
const secret = process.env.SESSION_SECRET;
const key = secret ? new TextEncoder().encode(secret) : null;

export async function encryptPayload(payload: JoseSession) {
    // If the key does not exist
    if (!key) {
        console.error("No key to encrypt payload")
        return null;
    }

    try {
        return new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256"})
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(key)
    } catch (error) {
        console.log("Failed to encrypt session payload", error);
        return null;
    }
}

export async function decryptPayload(session: string) {
    // If the key does not exist
    if (!key) {
        console.error("No key to decrypt payload")
        return null;
    }

    try {
        // Decrypt the session
        const {payload} = await jwtVerify(session, key, {
            algorithms: ["HS256"],
        });

        // Return the payload
        return payload as SessionPayload;
    } catch (error) {
        console.log("Failed to decrypt session", error);
        return null;
    }
}