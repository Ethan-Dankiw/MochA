"use client"

import React from "react"


// The context value used when using the context
export interface IAppContext {
}


// Create the context
export const AppContext = React.createContext<IAppContext | null>(null);


// Use the context to deconstruct the context value in child components
export const useApp = (): IAppContext => {
    // Use the context to get the context value
    const value: IAppContext | null = React.useContext(AppContext);

    // If the context value does not exist
    if (value === null) {
        throw new ReferenceError("useApp must be used within a child component of the context provider");
    }

    // Return the context value for deconstruction
    return value;
}