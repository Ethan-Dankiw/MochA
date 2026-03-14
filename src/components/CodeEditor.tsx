"use client";

import React, {useEffect, useRef} from "react";
import * as monaco from "monaco-editor";
import {Editor} from "@monaco-editor/react";
import {useCode} from "@/components/contexts/code/CodeContext";
import {useTheme} from "next-themes";

type Props = {
    initialCode?: string;
};

export default function CodeEditor(props: Readonly<Props>): React.ReactNode {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<typeof monaco | null>(null);
    const {setCode} = useCode();
    const { theme } = useTheme();

    // On load set the default code
    React.useEffect(() => {
        setCode(props.initialCode ?? "");
    }, [props.initialCode])

    const myCremeTheme = React.useMemo<monaco.editor.IStandaloneThemeData>(() => ({
        base: "vs",
        inherit: false, // prevent vs-light from overriding
        rules: [
            {token: "", foreground: theme === 'dark' ? "#b29d87" : "#573e23"}, // default text color (light brown)
            // you can add more token rules here if you want syntax highlighting
        ],
        colors: {
            "editor.background": theme === 'dark' ? "#110f0c" : "#fff2e2",           // creme background
            "editor.foreground": theme === 'dark' ? "#7a5d48" : "#8B7355",           // light brown text
            "editorLineNumber.foreground": theme === 'dark' ? "#77522a" : "#8B7355",
            "editorCursor.foreground": theme === 'dark' ? "#794a19" : "#6B4F3B",
            "editorIndentGuide.background": theme === 'dark' ? "#42280c" : "#E8E1D5",
            "editor.lineHighlightBorder": theme === 'dark' ? "#1f1810" : "#E8E1D5",
            "editor.lineHighlightBackground": theme === 'dark' ? "#1f1810" : "#E8E1D5",
        },
    }), [theme]);

    // Called when editor mounts
    function handleEditorMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof import("monaco-editor")) {
        editorRef.current = editor;
        monacoRef.current = monaco;
    }

    // Apply theme using useEffect
    useEffect(() => {
        if (monacoRef.current) {
            monacoRef.current.editor.defineTheme("creme-theme", myCremeTheme);
            monacoRef.current.editor.setTheme("creme-theme");
        }
    }, [myCremeTheme]); // empty dependency = run once

    return (
        <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue={props.initialCode}
            onMount={handleEditorMount}
            theme="creme-theme"
            onChange={(value) => setCode(value || "")}
        />
    );
}