import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";
import CodeEditor from "../../components/code-editor/CodeEditor";
import "../styles/StudentCodeEditor.css";

const StudentCodeEditor = () => {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  const fetchProblem = async () => {
    try {
      const res = await API.get(`/student/problems/${problemId}`);
      setProblem(res.data?.data);
      setCode(res.data?.data?.template || "");
    } catch (err) {
      alert("Error loading problem");
    } finally {
      setLoading(false);
    }
  };

  const handleRunTests = async () => {
    try {
      setSubmitting(true);
      const res = await API.post(`/student/problems/${problemId}/run`, {
        code,
        language,
      });
      setTestResults(res.data?.data);
      setShowResults(true);
    } catch (err) {
      alert("Error running tests");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await API.post(`/student/problems/${problemId}/submit`, {
        code,
        language,
      });
      alert("Solution submitted! Score: " + res.data?.data?.score);
      navigate("/student/submissions");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting solution");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading editor...</div>;
  if (!problem) return <div className="error">Problem not found</div>;

  return (
    <div className="code-editor-container">
      {/* Left Panel - Problem Description */}
      <div className="left-panel">
        <div className="panel-header">
          <h2>{problem.name}</h2>
          <span className={`difficulty ${problem.difficulty}`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="panel-content">
          <div className="problem-section">
            <h3>Description</h3>
            <p>{problem.statement}</p>
          </div>

          {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
            <div className="problem-section">
              <h3>Sample Test Cases</h3>
              {problem.sampleTestCases.map((testCase, idx) => (
                <div key={idx} className="test-case">
                  <div className="test-io">
                    <strong>Input:</strong>
                    <pre>{testCase.input}</pre>
                  </div>
                  <div className="test-io">
                    <strong>Expected Output:</strong>
                    <pre>{testCase.expectedOutput}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="problem-section">
            <h3>Constraints</h3>
            <p>Score: {problem.score} points</p>
            <p>Time Limit: 1 second</p>
            <p>Memory Limit: 256 MB</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="right-panel">
        <div className="editor-toolbar">
          <div className="toolbar-left">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
          <div className="toolbar-right">
            <button
              className="btn-run"
              onClick={handleRunTests}
              disabled={submitting}
            >
              ▶ Run Tests
            </button>
            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={submitting}
            >
              ✓ Submit
            </button>
          </div>
        </div>

        <div className="editor-wrapper">
          <CodeEditor code={code} setCode={setCode} language={language} />
        </div>

        {/* Test Results */}
        {showResults && testResults && (
          <div className="test-results">
            <h3>Test Results</h3>
            {testResults.passed ? (
              <div className="result-success">
                ✓ All tests passed! ({testResults.passedCount}/{testResults.totalTests})
              </div>
            ) : (
              <div className="result-failed">
                ✗ Some tests failed ({testResults.passedCount}/{testResults.totalTests})
              </div>
            )}
            <div className="result-details">
              <p>Execution Time: {testResults.executionTime}ms</p>
              <p>Memory Used: {testResults.memoryUsed}MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCodeEditor;
