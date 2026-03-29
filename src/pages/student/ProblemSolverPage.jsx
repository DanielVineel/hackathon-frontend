import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../../api/api";
import Modal from "../../components/common/Modal";
import "./ProblemSolverPage.css";

const ProblemSolverPage = () => {
  const { problemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Location state
  const locationState = location.state || {};
  const { eventId, attemptId, fromEventAttempt, remainingTime: initialTime } = locationState;

  // Data states
  const [problem, setProblems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Code editor states
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Timer states
  const [remainingTime, setRemainingTime] = useState(initialTime || 0);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  // Test results
  const [showTestResults, setShowTestResults] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [testMessage, setTestMessage] = useState("");

  // Timer countdown effect
  useEffect(() => {
    if (remainingTime <= 0 || !initialTime) return;

    if (remainingTime <= 300 && !showTimeWarning) {
      setShowTimeWarning(true);
    }

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          setIsTimeExpired(true);
          // Auto-submit when time expires
          if (code.trim()) {
            handleAutoSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime, initialTime]);

  useEffect(() => {
    fetchProblemDetails();
  }, [problemId]);

  /**
   * Format time remaining (HH:MM:SS)
   */
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  /**
   * Handle automatic submission when time expires
   */
  const handleAutoSubmit = async () => {
    if (submitting || !code.trim()) return;

    try {
      setSubmitting(true);

      const res = await API.post(`/submissions/submit`, {
        problemId,
        eventId: eventId || null,
        code,
        language,
        autoSubmitted: true
      });

      if (res.data?.submissionId) {
        alert("⏰ Time expired! Your solution has been automatically submitted.");
        localStorage.removeItem(`problem-code-${problemId}-${language}`);
        
        if (fromEventAttempt) {
          navigate(`/student/event/${eventId}/attempt`, {
            state: { autoSubmitted: true }
          });
        } else {
          navigate("/student/problems");
        }
      }
    } catch (err) {
      console.error("Auto-submit error:", err);
      alert("Time expired! Please submit your code manually.");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get(`/problems/${problemId}`);
      // Backend returns problem directly (not wrapped in { problem: ... })
      setProblems(res.data);

      // Load saved code from localStorage if available
      const savedCode = localStorage.getItem(`problem-code-${problemId}-${language}`);
      if (savedCode) {
        setCode(savedCode);
      }
    } catch (err) {
      console.error("Error fetching problem:", err);
      setError(err.response?.data?.message || "Failed to load problem");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    // Auto-save to localStorage
    localStorage.setItem(`problem-code-${problemId}-${language}`, newCode);
  };

  const handleLanguageChange = (newLanguage) => {
    // Save current code
    localStorage.setItem(`problem-code-${problemId}-${language}`, code);
    
    // Load code for new language
    const savedCode = localStorage.getItem(`problem-code-${problemId}-${newLanguage}`);
    setCode(savedCode || "");
    setLanguage(newLanguage);
  };

  const runSampleTests = async () => {
    if (!code.trim()) {
      alert("Please write some code first");
      return;
    }

    try {
      setSubmitting(true);
      setTestMessage("Running sample tests...");
      setShowTestResults(true);

      const res = await API.post(`/submissions/run`, {
        problemId,
        code,
        language
      });

      if (res.data?.results) {
        setTestResults(res.data.results);
        const passedCount = res.data.results.filter(r => r.passed).length;
        setTestMessage(`Results: ${passedCount}/${res.data.results.length} test cases passed`);
      }
    } catch (err) {
      setTestMessage(err.response?.data?.message || "Error running tests");
      setTestResults([]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please write some code first");
      return;
    }

    if (!isTimeExpired && !window.confirm("Are you sure you want to submit your solution?")) {
      return;
    }

    try {
      setSubmitting(true);

      const res = await API.post(`/submissions/submit`, {
        problemId,
        eventId: eventId || null,
        code,
        language
      });

      if (res.data?.submissionId) {
        alert("Submission received! Your solution will be evaluated.");
        // Clear saved code
        localStorage.removeItem(`problem-code-${problemId}-${language}`);
        
        if (fromEventAttempt) {
          navigate(`/student/event/${eventId}/attempt`);
        } else {
          navigate("/student/problems");
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !problem) {
    return (
      <div className="problem-solver-page loading">
        <div className="loader"></div>
        <p>Loading problem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="problem-solver-page error">
        <div className="error-message">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button
            className="btn-back"
            onClick={() => {
              if (fromEventAttempt) {
                navigate(`/student/event/${eventId}/attempt`);
              } else {
                navigate("/student/problems");
              }
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="problem-solver-page">
        <div className="error-message">
          <h2>Problem not found</h2>
          <button
            className="btn-back"
            onClick={() => {
              if (fromEventAttempt) {
                navigate(`/student/event/${eventId}/attempt`);
              } else {
                navigate("/student/problems");
              }
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="problem-solver-page">
      {/* Header with Timer */}
      <div className="solver-header">
        <div className="problem-header-info">
          <h1>{problem.title || problem.name}</h1>
          <div className="problem-meta-tags">
            <span className={`difficulty-tag ${(problem.difficulty || problem.level || "easy").toLowerCase()}`}>
              {(problem.difficulty || problem.level || "Easy").toUpperCase()}
            </span>
            <span className="points-tag">⭐ {problem.score || 100} pts</span>
          </div>
        </div>

        {/* Timer Display */}
        {initialTime > 0 && (
          <div className={`timer-display ${isTimeExpired ? "expired" : remainingTime < 300 ? "warning" : ""}`}>
            <span className="timer-label">Time Remaining</span>
            <span className="timer-value">{formatTime(remainingTime)}</span>
            {remainingTime < 300 && remainingTime > 0 && (
              <span className="timer-warning-text">⏰ Time running out!</span>
            )}
            {isTimeExpired && (
              <span className="timer-expired-text">⏰ Time's Up!</span>
            )}
          </div>
        )}

        <button
          className="btn-back"
          onClick={() => {
            if (fromEventAttempt) {
              navigate(`/student/event/${eventId}/attempt`);
            } else {
              navigate("/student/problems");
            }
          }}
        >
          ← Back
        </button>
      </div>

      {/* Time Warning Modal */}
      {showTimeWarning && remainingTime > 0 && (
        <div className="time-warning-banner">
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">Less than 5 minutes remaining! Submit your solution soon.</span>
          <button className="close-warning" onClick={() => setShowTimeWarning(false)}>✕</button>
        </div>
      )}

      <div className="solver-container">
        {/* Problem Description */}
        <div className="problem-panel">
          <div className="panel-header">
            <h2>Problem Description</h2>
          </div>

          <div className="panel-content">
            <h3>Problem Statement</h3>
            <p className="statement">{problem.description}</p>

            {/* Sample Test Cases */}
            <h3 style={{ marginTop: "30px" }}>Sample Test Cases</h3>
            {problem.sampleTestCases && problem.sampleTestCases.length > 0 ? (
              <div className="test-cases">
                {problem.sampleTestCases.map((testCase, idx) => (
                  <div key={idx} className="test-case">
                    <div className="test-case-item">
                      <span className="test-label">Input:</span>
                      <pre className="test-value">{testCase.input || testCase.sampleInput}</pre>
                    </div>
                    <div className="test-case-item">
                      <span className="test-label">Expected Output:</span>
                      <pre className="test-value">{testCase.output || testCase.expectedOutput}</pre>
                    </div>
                    {(testCase.explanation || testCase.sampleExplanation) && (
                      <div className="test-case-item">
                        <span className="test-label">Explanation:</span>
                        <p className="test-value">{testCase.explanation || testCase.sampleExplanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-test-cases">No sample test cases available</p>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="editor-panel">
          {/* Language Selector */}
          <div className="editor-controls">
            <div className="language-selector">
              <label>Language:</label>
              <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div className="editor-buttons">
              <button
                className="btn btn-secondary"
                onClick={runSampleTests}
                disabled={submitting}
              >
                {submitting ? "Testing..." : "▶ Run Tests"}
              </button>
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "✓ Submit Solution"}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <textarea
            className="code-editor"
            value={code}
            onChange={handleCodeChange}
            placeholder={`//Write your ${language.toUpperCase()} code here...\n\nint main(){\n  \n  return 0;\n}`}
            disabled={submitting}
          />

          {/* Test Results Modal */}
          {showTestResults && (
            <Modal
              isOpen={showTestResults}
              onClose={() => setShowTestResults(false)}
              title="Test Results"
            >
              <div className="modal-content test-results">
                <p className="test-message">{testMessage}</p>

                {testResults.length > 0 && (
                  <div className="results-list">
                    {testResults.map((result, idx) => (
                      <div key={idx} className={`result-item ${result.passed ? "passed" : "failed"}`}>
                        <div className="result-header">
                          <span className="result-number">Test Case {idx + 1}</span>
                          <span className={`result-badge ${result.passed ? "passed" : "failed"}`}>
                            {result.passed ? "✓ PASSED" : "✗ FAILED"}
                          </span>
                        </div>

                        <div className="result-details">
                          <div className="detail-item">
                            <span className="detail-label">Input:</span>
                            <pre className="detail-value">{result.input}</pre>
                          </div>

                          <div className="detail-item">
                            <span className="detail-label">Expected:</span>
                            <pre className="detail-value">{result.expected}</pre>
                          </div>

                          <div className="detail-item">
                            <span className="detail-label">Output:</span>
                            <pre className={`detail-value ${result.passed ? "correct" : "wrong"}`}>
                              {result.output || "No output"}
                            </pre>
                          </div>

                          {result.error && (
                            <div className="detail-item">
                              <span className="detail-label">Error:</span>
                              <pre className="detail-value error">{result.error}</pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowTestResults(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSolverPage;
