"use client"

import React from "react"
import {ISessionPayload, SessionPayload} from "@/lib/types/session";


// The context value used when using the context
export interface ISessionContext {
    session: ISessionPayload | null;
    isLoading: boolean;
    refreshSession: () => Promise<void>;
    logout: () => Promise<void>;
}

// Create the context
export const SessionContext = React.createContext<ISessionContext | null>(null);


// Use the context to deconstruct the context value in child components
export const useSession = (): ISessionContext => {
    // Use the context to get the context value
    const value: ISessionContext | null = React.useContext(SessionContext);

    // If the context value does not exist
    if (value === null) {
        throw new ReferenceError("useSession must be used within a child component of the context provider");
    }

    // Return the context value for deconstruction
    return value;
}