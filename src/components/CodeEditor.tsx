"use client"

import React from "react";
import {Editor} from "@monaco-editor/react";

type Props = {
    initialCode?: string;
}

export default function CodeEditor(props: Readonly<Props>): React.ReactNode {
    // Store the written code
    const [code, setCode] = React.useState<string | null>(props.initialCode ?? null);

    return (
        <Editor
            height={"100%"}
            defaultLanguage="javascript"
            defaultValue={props.initialCode}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
        />
    );
}