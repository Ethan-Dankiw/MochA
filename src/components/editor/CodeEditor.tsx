"use client";

import React, {useRef} from "react";
import * as monaco from "monaco-editor";
import {Editor} from "@monaco-editor/react";
import {useCode} from "@/components/contexts/code/CodeContext";
import {useTheme} from "next-themes";

type Props = {
    initialCode?: string;
};

const LIGHT_BACKGROUND = "#fff2e2"
const LIGHT_BACKGROUND_THEME = `bg-[#fff2e2]`
const DARK_BACKGROUND = "#110f0c"
const DARK_BACKGROUND_THEME = `bg-[#110f0c]`

export default function CodeEditor(props: Readonly<Props>): React.ReactNode {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const {code, setCode, language} = useCode();
    const {resolvedTheme} = useTheme();

    // On load set the default code
    React.useEffect(() => {
        setCode(props.initialCode ?? "");
    }, [props.initialCode])

    React.useEffect(() => {
        const container = editorRef.current?.getDomNode?.();
        if (!container) return;

        const stopDrag = () => {
            container.focus();
        };

        container.addEventListener("pointerleave", stopDrag);
        return () => container.removeEventListener("pointerleave", stopDrag);
    }, []);

    const mountThemes = (editor: typeof monaco) => {
        // Define the light mode theme
        editor.editor.defineTheme("creme-light", {
            base: "vs",
            inherit: false,
            rules: [
                {token: "", foreground: "#573e23"},
            ],
            colors: {
                "editor.background": LIGHT_BACKGROUND,
                "editor.foreground": "#8B7355",
                "editorLineNumber.foreground": "#8B7355",
                "editorCursor.foreground": "#6B4F3B",
                "editorIndentGuide.background": "#E8E1D5",
                "editor.lineHighlightBorder": "#ffeed9",
                "editor.lineHighlightBackground": "#ffeed9",
                "editorLineNumber.activeForeground": "#573e23",
                "editorBracketMatch.background": "#E8E1D5",
                "editorBracketMatch.border": "#8B7355",
                "editorBracketHighlight.foreground1": "#bd6b14",
                "editorBracketHighlight.foreground2": "#8c4e0d",
                "editorBracketHighlight.foreground3": "#643708",
                "editorBracketHighlight.unexpectedBracket.foreground": "#ff4444",
                "scrollbarSlider.background": "#f1d9c4",
                "scrollbarSlider.hoverBackground": "#dcbfa6",
                "scrollbarSlider.activeBackground": "#cfae8f",
                "scrollbar.shadow": "#E8E1D5",
            }
        })

        // Define the dark mode theme
        editor.editor.defineTheme("espresso-dark", {
            base: "vs",
            inherit: false,
            rules: [
                {token: "", foreground: "#b29d87"},
            ],
            colors: {
                "editor.background": DARK_BACKGROUND,
                "editor.foreground": "#7a5d48",
                "editorLineNumber.foreground": "#77522a",
                "editorCursor.foreground": "#794a19",
                "editorIndentGuide.background": "#42280c",
                "editor.lineHighlightBorder": "#1f1810",
                "editor.lineHighlightBackground": "#1f1810",
                "editorLineNumber.activeForeground": "#d4c4b7",
                "editorBracketMatch.background": "#1f1810",
                "editorBracketMatch.border": "#7a5d48",
                "editorBracketHighlight.foreground1": "#bd6b14",
                "editorBracketHighlight.foreground2": "#8c4e0d",
                "editorBracketHighlight.foreground3": "#643708",
                "editorBracketHighlight.unexpectedBracket.foreground": "#ff4444",
                "scrollbarSlider.background": "#1f1810",
                "scrollbarSlider.hoverBackground": "#33271b",
                "scrollbarSlider.activeBackground": "#4a3928",
                "scrollbar.shadow": "#1f1810",
            },
        })
    }

    // Define the function that mounts the editor
    const mountEditor = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor
    }

    return (
        <div className={`h-full relative ${resolvedTheme === "dark" ? DARK_BACKGROUND_THEME : LIGHT_BACKGROUND_THEME}`}>
            <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                beforeMount={mountThemes}
                onMount={mountEditor}
                theme={resolvedTheme === 'dark' ? "espresso-dark" : "creme-light"}
                options={{
                    minimap: {enabled: false},
                    smoothScrolling: true,
                }}
            />
        </div>
    );
}