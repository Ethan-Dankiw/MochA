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
    const {setCode} = useCode();
    const { resolvedTheme } = useTheme();

    // On load set the default code
    React.useEffect(() => {
        setCode(props.initialCode ?? "");
    }, [props.initialCode])

    // const myCremeTheme = React.useMemo<monaco.editor.IStandaloneThemeData>(() => ({
    //     base: "vs",
    //     inherit: false, // prevent vs-light from overriding
    //     rules: [
    //         {token: "", foreground: theme === 'dark' ? "#b29d87" : "#573e23"}, // default text color (light brown)
    //         // you can add more token rules here if you want syntax highlighting
    //     ],
    //     colors: {
    //         "editor.background": theme === 'dark' ? "#110f0c" : "#fff2e2",
    //         "editor.foreground": theme === 'dark' ? "#7a5d48" : "#8B7355",
    //         "editorLineNumber.foreground": theme === 'dark' ? "#77522a" : "#8B7355",
    //         "editorCursor.foreground": theme === 'dark' ? "#794a19" : "#6B4F3B",
    //         "editorIndentGuide.background": theme === 'dark' ? "#42280c" : "#E8E1D5",
    //         "editor.lineHighlightBorder": theme === 'dark' ? "#1f1810" : "#E8E1D5",
    //         "editor.lineHighlightBackground": theme === 'dark' ? "#1f1810" : "#E8E1D5",
    //     },
    // }), [theme]);

    const mountThemes = (editor: typeof monaco) => {
        // Define the light mode theme
        editor.editor.defineTheme("creme-light", {
            base: "vs",
            inherit: false,
            rules: [
                { token: "", foreground: "#573e23" },
            ],
            colors: {
                "editor.background": "#fff2e2",
                "editor.foreground": "#8B7355",
                "editorLineNumber.foreground": "#8B7355",
                "editorCursor.foreground": "#6B4F3B",
                "editorIndentGuide.background": "#E8E1D5",
                "editor.lineHighlightBorder": "#ffeed9",
                "editor.lineHighlightBackground": "#ffeed9",
            }
        })

        // Define the dark mode theme
        editor.editor.defineTheme("espresso-dark", {
            base: "vs",
            inherit: false,
            rules: [
                { token: "", foreground: "#b29d87" },
            ],
            colors: {
                "editor.background": "#110f0c",
                "editor.foreground": "#7a5d48",
                "editorLineNumber.foreground": "#77522a",
                "editorCursor.foreground": "#794a19",
                "editorIndentGuide.background": "#42280c",
                "editor.lineHighlightBorder": "#1f1810",
                "editor.lineHighlightBackground": "#1f1810",
            }
        })
    }

    // Define the function that mounts the editor
    const mountEditor = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor
    }

    // Determine the theme being used
    const theme = resolvedTheme === 'dark' ? "espresso-dark" : "creme-light";

    return (
        <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue={props.initialCode}
            beforeMount={mountThemes}
            onMount={mountEditor}
            theme={theme}
            onChange={(value) => setCode(value || "")}
        />
    );
}