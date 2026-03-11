// src/components/code-editor/CodeEditor.jsx

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

const CodeEditor = ({ code, setCode, language }) => {

  const getLanguageExtension = () => {
    switch (language) {
      case "javascript":
        return javascript();
      case "cpp":
      case "c++":
        return cpp();
      case "python":
        return python();
      default:
        return javascript();
    }
  };

  return (
    <CodeMirror
      value={code}
      height="400px"
      theme={oneDark}
      extensions={[getLanguageExtension()]}
      onChange={(value) => {
        setCode(value);
      }}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        foldGutter: true,
      }}
    />
  );
};

export default CodeEditor;

