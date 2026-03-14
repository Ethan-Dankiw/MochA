"use client"

import React from "react"
import {CodeContext, ICodeContext} from "@/components/contexts/code/CodeContext";
import {SupportedLanguages} from "@/lib/types/languages";
import {ISessionContext, SessionContext} from "@/components/contexts/session/SessionContext";
import {destroySession, getSessionPayload} from "@/lib/session/session";
import {getSession, signOut} from "next-auth/react";
import {ISessionPayload} from "@/lib/types/session";

// The type used to provide interface values to the context provider component
type Props = {
    children: React.ReactNode;
}

// React context provider component used to expose the context to children
export function SessionProvider(props: Readonly<Props>): React.ReactNode {
    const [session, setSession] = React.useState<ISessionPayload | null>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    // Re-fetches the session cookie from the server
    const refreshSession = React.useCallback(async () => {
        setIsLoading(true);
        const currentSession = await getSessionPayload();
        setSession(currentSession);
        setIsLoading(false);
    }, [setIsLoading, setSession]);

    const logout = React.useCallback(async () => {
        // 1. Clear your custom cookie first
        await destroySession();

        // 2. Then trigger the NextAuth logout
        // callbackUrl: "/" sends them back to the landing page after clearing
        await signOut({ callbackUrl: "/" });

        // Refresh the session
        await refreshSession();
    }, [refreshSession])

    // Load session exactly once when the app mounts
    React.useEffect(() => {
        refreshSession().then(() => {});
    }, []);

    // Memoize the context value to its no re-computed on renders unnecessarily
    const value = React.useMemo<ISessionContext>(() => {
        return {
            session: session,
            isLoading: isLoading,
            refreshSession: refreshSession,
            logout: logout,
        }
    }, [logout, session, isLoading, refreshSession]);

    // Return the provider component
    return (
        <SessionContext.Provider value={value}>
            {props.children}
        </SessionContext.Provider>
    )
}