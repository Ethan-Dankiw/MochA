"use client"

import React from "react"


// The context value used when using the context
export interface ICodeContext {
    setCode: (code: string) => void
    code: string,
}


// Create the context
export const CodeContext = React.createContext<ICodeContext | null>(null);


// Use the context to deconstruct the context value in child components
export const useCode = (): ICodeContext => {
    // Use the context to get the context value
    const value: ICodeContext | null = React.useContext(CodeContext);

    // If the context value does not exist
    if (value === null) {
        throw new ReferenceError("useCode must be used within a child component of the context provider");
    }

    // Return the context value for deconstruction
    return value;
}