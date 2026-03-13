"use client"

import React from "react";
import {Editor} from "@monaco-editor/react";
import {useCode} from "@/components/contexts/code/CodeContext";

type Props = {
    initialCode?: string;
}

export default function CodeEditor(props: Readonly<Props>): React.ReactNode {
    const {setCode} = useCode();

    // On load set the default code
    React.useEffect(() => {
        setCode(props.initialCode ?? "");
    }, [props.initialCode])

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