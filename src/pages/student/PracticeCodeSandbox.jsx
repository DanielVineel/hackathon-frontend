import React, { useState, useEffect } from "react";
import API from "../../api/api";
import CodeEditor from "../../components/code-editor/CodeEditor";
import "../styles/student/CodeEditor.css";

/**
 * Practice Code Sandbox
 * Allows students to write and run arbitrary code without problem constraints
 * Useful for exploring languages, testing snippets, and learning by experimentation
 */
const PracticeCodeSandbox = () => {
  const [code, setCode] = useState(``);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [stdin, setStdin] = useState("");
  const [executionTime, setExecutionTime] = useState(0);
  const [memory, setMemory] = useState(0);

  // Fetch available languages on mount
  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const res = await API.get("/problems/languages/available");
      if (res.data?.data) {
        setLanguages(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch languages:", err);
      setLanguages([
        { id: 63, name: "JavaScript" },
        { id: 71, name: "Python" },
        { id: 54, name: "C++" },
        { id: 50, name: "C" },
        { id: 62, name: "Java" }
      ]);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError("Please write some code first!");
      return;
    }

    try {
      setIsRunning(true);
      setError(null);
      setOutput("");

      const startTime = performance.now();

      // Get language ID
      const langId = parseInt(language);

      const res = await API.post("/submissions/sandbox/run", {
        code: code,
        language: langId,
        input: stdin || undefined,
        expectedOutput: ""
      });

      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));

      if (res.data?.results) {
        const results = res.data.results;
        if (results.length > 0) {
          const firstResult = results[0];
          setOutput(firstResult.output || "No output produced");
          setMemory(firstResult.memory || 0);
        }
      } else if (res.data?.output) {
        setOutput(res.data.output);
      } else {
        setOutput("Code executed successfully but produced no output");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error running code";
      setError(errorMsg);
      setOutput("");
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setOutput("");
    setStdin("");
    setError(null);
    setExecutionTime(0);
    setMemory(0);
  };

  const handleDownloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="practice-code-sandbox">
      <div className="sandbox-header">
        <h1>Practice Code Sandbox</h1>
        <p>Write, test, and explore code in any supported language</p>
      </div>

      <div className="sandbox-container">
        {/* LEFT PANEL - Code Editor */}
        <div className="sandbox-editor-panel">
          <div className="panel-header">
            <h3>Code Editor</h3>
            <div className="language-selector">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isRunning}
                className="language-select"
              >
                {languages.length > 0 ? (
                  languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="63">JavaScript</option>
                    <option value="71">Python</option>
                    <option value="54">C++</option>
                    <option value="50">C</option>
                    <option value="62">Java</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <textarea
            className="code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isRunning}
            placeholder="Write your code here..."
          />

          <div className="editor-actions">
            <button
              className="btn btn-primary"
              onClick={handleRunCode}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "▶ Run Code"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={isRunning}
            >
              🗑️ Clear
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleDownloadCode}
              disabled={isRunning || !code.trim()}
            >
              ⬇️ Download
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - Output & Input */}
        <div className="sandbox-output-panel">
          {/* Input Section */}
          <div className="output-section">
            <h3>Standard Input (Optional)</h3>
            <textarea
              className="input-textarea"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              disabled={isRunning}
              placeholder="Provide input for your program here..."
            />
          </div>

          {/* Output Section */}
          <div className="output-section">
            <h3>Output</h3>
            {error && (
              <div className="output-error">
                <strong>Error:</strong> {error}
              </div>
            )}
            <pre className="output-content">
              {output || (error ? "" : "Output will appear here...")}
            </pre>

            {/* Stats */}
            {output && !error && (
              <div className="execution-stats">
                <div className="stat">
                  <span className="stat-label">Execution Time:</span>
                  <span className="stat-value">{executionTime}ms</span>
                </div>
                {memory > 0 && (
                  <div className="stat">
                    <span className="stat-label">Memory:</span>
                    <span className="stat-value">{memory} KB</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .practice-code-sandbox {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #1e1e1e;
          color: #d4d4d4;
          font-family: 'Fira Code', monospace;
        }

        .sandbox-header {
          padding: 20px 30px;
          background: #2d2d2d;
          border-bottom: 1px solid #3e3e42;
        }

        .sandbox-header h1 {
          margin: 0;
          font-size: 24px;
          color: #4ec9b0;
        }

        .sandbox-header p {
          margin: 5px 0 0 0;
          color: #858585;
          font-size: 14px;
        }

        .sandbox-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          flex: 1;
          overflow: hidden;
          background: #3e3e42;
        }

        .sandbox-editor-panel,
        .sandbox-output-panel {
          display: flex;
          flex-direction: column;
          background: #1e1e1e;
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #2d2d2d;
          border-bottom: 1px solid #3e3e42;
        }

        .panel-header h3 {
          margin: 0;
          color: #4ec9b0;
          font-size: 16px;
        }

        .language-selector {
          display: flex;
          gap: 10px;
        }

        .language-select {
          padding: 8px 12px;
          background: #3c3c3c;
          color: #d4d4d4;
          border: 1px solid #555;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
        }

        .language-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .code-textarea {
          flex: 1;
          padding: 15px;
          background: #1e1e1e;
          color: #d4d4d4;
          border: none;
          font-family: 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.6;
          resize: none;
        }

        .code-textarea:disabled {
          opacity: 0.6;
        }

        .code-textarea::placeholder {
          color: #555;
        }

        .input-textarea {
          width: 100%;
          height: 100px;
          padding: 10px;
          background: #2d2d2d;
          color: #d4d4d4;
          border: 1px solid #3e3e42;
          border-radius: 4px;
          font-family: 'Fira Code', monospace;
          font-size: 12px;
          resize: none;
        }

        .input-textarea:disabled {
          opacity: 0.6;
        }

        .input-textarea::placeholder {
          color: #555;
        }

        .editor-actions {
          display: flex;
          gap: 10px;
          padding: 15px 20px;
          background: #2d2d2d;
          border-top: 1px solid #3e3e42;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #007acc;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #005a9e;
        }

        .btn-secondary {
          background: #3c3c3c;
          color: #d4d4d4;
          border: 1px solid #555;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #4c4c4c;
        }

        .output-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 15px 20px;
          border-bottom: 1px solid #3e3e42;
        }

        .output-section h3 {
          margin: 0 0 10px 0;
          color: #4ec9b0;
          font-size: 14px;
        }

        .output-section:last-child {
          border-bottom: none;
          flex: 2;
        }

        .output-content {
          flex: 1;
          padding: 10px;
          background: #1e1e1e;
          border: 1px solid #3e3e42;
          border-radius: 4px;
          color: #ce9178;
          font-size: 12px;
          line-height: 1.5;
          overflow: auto;
          white-space: pre-wrap;
          word-break: break-word;
          margin: 0;
        }

        .output-error {
          padding: 10px;
          background: #3d1f1f;
          border: 1px solid #5c2e2e;
          border-radius: 4px;
          color: #f48771;
          font-size: 12px;
          margin-bottom: 10px;
        }

        .execution-stats {
          display: flex;
          gap: 20px;
          margin-top: 10px;
          font-size: 12px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stat-label {
          color: #858585;
        }

        .stat-value {
          color: #4ec9b0;
          font-weight: 600;
        }

        @media (max-width: 1200px) {
          .sandbox-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PracticeCodeSandbox;
