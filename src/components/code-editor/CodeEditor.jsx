// src/components/code-editor/CodeEditor.jsx
import React from "react";
import { Controlled as CodeMirror } from "@uiw/react-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

const CodeEditor = ({ code, setCode, language }) => {
  return (
    <CodeMirror
      value={code}
      options={{
        mode: language,
        theme: "material",
        lineNumbers: true,
      }}
      onBeforeChange={(editor, data, value) => {
        setCode(value);
      }}
    />
  );
};

export default CodeEditor;