"use server"

import {cookies} from "next/headers";

export async function storeCookie(name: string, value: string, expiry: Date) {
    // Get the cookie store
    const store = await cookies()

    // Store the cookie in the browser
    store.set(name, value, {
        httpOnly: true,
        secure: true,
        expires: expiry,
        sameSite: "lax",
        path: "/"
    })
}

export async function deleteCookie(name: string) {
    // Get the cookie store
    const store = await cookies()

    // Delete the cookie
    store.delete(name)
}

export async function fetchCookie(name: string) {
    // Get the cookie store
    const store = await cookies()

    // Get the cookie by the name
    return store.get(name) ?? null;
}