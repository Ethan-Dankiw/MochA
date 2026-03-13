"use client"

import React from "react"
import {CodeContext, ICodeContext} from "@/components/contexts/code/CodeContext";

// The type used to provide interface values to the context provider component
type Props = {
    children: React.ReactNode;
}

// React context provider component used to expose the context to children
export function CodeProvider(props: Readonly<Props>): React.ReactNode {
    // Store the code being displayed in the code editor so it can be sent along with chat messages
    const [code, setCode] = React.useState<string>("")

    // Memoize the context value to its no re-computed on renders unnecessarily
    const value = React.useMemo<ICodeContext>(() => {
        return {
            code: code,
            setCode: setCode,
        }
    }, [code, setCode]);

    // Return the provider component
    return (
        <CodeContext.Provider value={value}>
            {props.children}
        </CodeContext.Provider>
    )
}