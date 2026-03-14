"use client";

import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import {Editor} from "@monaco-editor/react";
import {useCode} from "@/components/contexts/code/CodeContext";

type Props = {
  initialCode?: string;
};

export default function CodeEditor(props: Readonly<Props>): React.ReactNode {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);
    const {setCode} = useCode();

    // On load set the default code
    React.useEffect(() => {
        setCode(props.initialCode ?? "");
    }, [props.initialCode])

  const myCremeTheme = React.useMemo<monaco.editor.IStandaloneThemeData>(() => ({
    base: "vs",
  inherit: false, // prevent vs-light from overriding
  rules: [
    { token: "", foreground: "#573e23" }, // default text color (light brown)
    // you can add more token rules here if you want syntax highlighting
  ],
  colors: {
    "editor.background": "#ccbfaf",           // creme background
    "editor.foreground": "#8B7355",           // light brown text
    "editorLineNumber.foreground": "#8B7355",
    "editorCursor.foreground": "#6B4F3B",
    "editorIndentGuide.background": "#E8E1D5",
    },
  }), []);

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