// src/components/code-editor/CodeEditor.jsx

import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { 
  JUDGE0_LANGUAGES, 
  getLanguageNameFromId, 
  hasSyntaxHighlighting,
  getSyntaxHighlighterName,
  getAllLanguagesExtended
} from "../../utils/judge0Languages";
import "./CodeEditor.css";

/**
 * Enhanced Reusable Code Editor Component
 * Supports all Judge0 languages (80+) with intelligent syntax highlighting
 * 
 * @param {Object} props
 * @param {string} props.code - Current code value
 * @param {function} props.setCode - Function to update code
 * @param {string} props.language - Programming language (python, cpp, java, javascript, c, or language ID)
 * @param {function} props.onLanguageChange - Callback when language changes
 * @param {function} props.onRunTests - Callback for run tests button
 * @param {function} props.onSubmit - Callback for submit button
 * @param {boolean} props.loading - Loading state
 * @param {string} props.mode - "problem" or "event" - affects layout style
 * @param {number} props.height - Editor height (default: 400px)
 * @param {boolean} props.showButtons - Show run/submit buttons (default: true)
 * @param {Object} props.testResults - Test results to display
 * @param {Array} props.allowedLanguageIds - Array of Judge0 language IDs (e.g., [54, 71, 63])
 */
const CodeEditor = ({
  code,
  setCode,
  language,
  onLanguageChange,
  onRunTests,
  onSubmit,
  loading = false,
  mode = "problem",
  height = "400px",
  showButtons = true,
  testResults = [],
  allowedLanguageIds = [54, 50, 62, 63, 71] // Default: all languages
}) => {
  const [activeTab, setActiveTab] = useState("code");

  /**
   * Get CodeMirror syntax extension based on language
   * Provides intelligent fallback for unsupported languages
   */
  const getLanguageExtension = () => {
    const normalizedLang = language.toLowerCase();
    
    // Map language to extension
    switch (normalizedLang) {
      case "javascript":
      case "63":
      case "typescript":
      case "74":
        return javascript();
      
      case "cpp":
      case "c++":
      case "54":
      case "c":
      case "50":
      case "java":
      case "62":
      case "objectivec":
      case "40":
      case "csharp":
      case "51":
      case "rust":
      case "73":
      case "go":
      case "60":
        return cpp(); // C-family languages use C++ syntax highlighting
      
      case "python":
      case "71":
        return python();
      
      // All other languages: fallback to C++ (most similar generic syntax)
      default:
        return cpp();
    }
  };

  /**
   * Get filtered languages that are allowed for this problem
   * Includes both default and extended languages
   */
  const getAllowedLanguages = () => {
    const allLanguages = getAllLanguagesExtended();
    return allowedLanguageIds
      .map(id => allLanguages[id])
      .filter(Boolean);
  };

  /**
   * Convert language ID or name to normalized name for the code editor
   */
  const getLanguageNameForCodeEditor = (lang) => {
    // If it's a numeric ID, convert to name
    if (/^\d+$/.test(lang)) {
      return getLanguageNameFromId(parseInt(lang)) || "cpp";
    }
    
    // Otherwise assume it's already a name
    return lang.toLowerCase();
  };

  /**
   * Get display name for current language with highlighting status
   */
  const getCurrentLanguageDisplay = () => {
    const langId = parseInt(language) || Object.entries(getAllLanguagesExtended())
      .find(([_, lang]) => lang.name === language.toLowerCase())?.[0];
    
    if (!langId) return "Select Language";
    
    const lang = getAllLanguagesExtended()[langId];
    if (!lang) return "Select Language";
    
    const hasHighlight = hasSyntaxHighlighting(langId);
    return `${lang.displayName}${!hasHighlight ? " (basic text)" : ""}`;
  };

  const currentLanguageName = getLanguageNameForCodeEditor(language);
  const allowedLanguages = getAllowedLanguages();

  return (
    <div className={`code-editor-container mode-${mode}`}>
      {/* Toolbar */}
      <div className="code-editor-toolbar">
        <div className="toolbar-left">
          <label className="language-label">Language:</label>
          <select
            value={currentLanguageName}
            onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
            className="language-select"
            disabled={loading}
            title={getCurrentLanguageDisplay()}
          >
            {allowedLanguages.map(lang => (
              <option key={lang.id} value={lang.name.toLowerCase()}>
                {lang.displayName}
              </option>
            ))}
          </select>
          {!hasSyntaxHighlighting(parseInt(language) || 54) && (
            <span className="lang-warning" title="Syntax highlighting not available for this language">
              ℹ Basic text editor mode
            </span>
          )}
        </div>

        {showButtons && (
          <div className="toolbar-right">
            <button
              className="btn btn-run"
              onClick={onRunTests}
              disabled={loading || !code.trim()}
              title="Run sample test cases"
            >
              ▶ Run Tests
            </button>
            <button
              className="btn btn-submit"
              onClick={onSubmit}
              disabled={loading || !code.trim()}
              title="Submit your solution"
            >
              ✓ Submit
            </button>
          </div>
        )}
      </div>

      {/* Tab for results (if in event mode with results) */}
      {mode === "event" && (
        <div className="editor-tabs">
          <button
            className={`tab ${activeTab === "code" ? "active" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </button>
          {testResults.length > 0 && (
            <button
              className={`tab ${activeTab === "results" ? "active" : ""}`}
              onClick={() => setActiveTab("results")}
            >
              Test Results ({testResults.filter(r => r.passed).length}/{testResults.length})
            </button>
          )}
        </div>
      )}

      {/* Code Editor or Results */}
      {activeTab === "code" ? (
        <CodeMirror
          value={code}
          height={height}
          theme={oneDark}
          extensions={[getLanguageExtension()]}
          onChange={(value) => {
            setCode(value);
          }}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            foldGutter: true,
            highlightSpecialChars: true,
          }}
          className="code-mirror-editor"
        />
      ) : (
        <div className="test-results-panel">
          {testResults.map((result, idx) => (
            <div key={`result-${idx}-${result.input?.substring(0, 10) || ''}`} className={`result-card ${result.passed ? "passed" : "failed"}`}>
              <div className="result-header">
                <span className="result-num">Test {idx + 1}</span>
                <span className={`badge ${result.passed ? "pass" : "fail"}`}>
                  {result.passed ? "✓ PASSED" : "✗ FAILED"}
                </span>
              </div>
              <div className="result-body">
                <div className="result-io">
                  <span className="label">Input:</span>
                  <pre>{result.input}</pre>
                </div>
                <div className="result-io">
                  <span className="label">Expected:</span>
                  <pre>{result.expected}</pre>
                </div>
                <div className="result-io">
                  <span className="label">Output:</span>
                  <pre className={result.passed ? "correct" : "wrong"}>{result.output || "No output"}</pre>
                </div>
                {result.error && (
                  <div className="result-io error">
                    <span className="label">Error:</span>
                    <pre>{result.error}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
