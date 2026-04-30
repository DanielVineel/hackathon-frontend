import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../../api/api";
import CodeEditor from "../../components/code-editor/CodeEditor";
import "../styles/student/ProblemSolverPage.css";

const ProblemSolverPage = () => {
  const { problemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Location state
  const locationState = location.state || {};
  const { eventId, attemptId, fromEventAttempt, initialRemainingTime } = locationState;

  // Data states
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Code editor states
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Timer states
  const [remainingTime, setRemainingTime] = useState(initialRemainingTime || 0);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [problemStartId, setProblemStartId] = useState(null);

  // Test results
  const [testResults, setTestResults] = useState([]);

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
   * Fetch problem details and restore timer from backend if exists
   */
  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch problem
      let problemEndpoint = `/problems/${problemId}`;
     

      const res = await API.get(problemEndpoint);
      setProblem(res.data);

      // Restore timer from backend
      await restoreTimerFromBackend();

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

  /**
   * Start solving a problem - save start time to backend
   */
  const startProblemSolving = async () => {
    // NOTE: Backend endpoints for tracking problem solve start do not exist
    // Setting default remaining time as fallback
    try {
      // Attempt to get timer info from event if available
     
        setRemainingTime(3600); // Default 1 hour for practice
      
    } catch (err) {
      console.error("Error getting timer info:", err);
      setRemainingTime(3600); // Default fallback
    }
  };

  /**
   * Restore timer from backend for disconnected sessions
   */
  const restoreTimerFromBackend = async () => {
    // NOTE: Backend endpoints for tracking problem solve remaining time do not exist
    // Setting default time for practice/event mode
    try {
      
        // Practice mode - use default 1 hour
        setRemainingTime(3600);
      
    } catch (err) {
      console.error("Error fetching timer from backend:", err);
      // Default to 1 hour
      setRemainingTime(3600);
    }
  };

  /**
   * Timer countdown effect
   */
  useEffect(() => {
    if (remainingTime <= 0 || !problemStartId) return;

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
  }, [remainingTime, problemStartId]);

  /**
   * Fetch problem and try to restore timer on mount
   */
  useEffect(() => {
    fetchProblemDetails();
  }, [problemId, eventId]);

  /**
   * Start problem solving after problem is loaded
   */
  useEffect(() => {
    if (problem && !problemStartId && !initialRemainingTime) {
      startProblemSolving();
    }
  }, [problem, problemStartId, initialRemainingTime]);

  /**
   * Handle automatic submission when time expires
   */
  const handleAutoSubmit = async () => {
    if (submitting || !code.trim()) return;

    try {
      setSubmitting(true);

      const endpoint = eventId
        ? `/submissions/event/submit`
        : `/submissions/submit`;

      const res = await API.post(endpoint, {
        problemId,
        eventId: eventId || null,
        code,
        language,
        autoSubmitted: true
      });

      if (res.data?.submissionId) {
        alert("⏰ Time expired! Your solution has been automatically submitted.");
        localStorage.removeItem(`problem-code-${problemId}-${language}`);
        
        if (fromEventAttempt && eventId) {
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

  const handleCodeChange = (newCode) => {
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
    console.log("🔵 runSampleTests called");
    
    if (!code.trim()) {
      console.warn("No code entered");
      alert("Please write some code first");
      return;
    }

    if (!problemId) {
      console.error("Problem ID is missing", { problemId });
      alert("Error: Problem ID not found");
      return;
    }

    try {
      setSubmitting(true);
      console.log("attempting to run tests", { problemId, eventId, language });

      const endpoint = eventId
        ? `/submissions/event/run`
        : `/submissions/run`;

      console.log("API endpoint:", endpoint);

      const res = await API.post(endpoint, {
        problemId,
        eventId: eventId || null,
        code,
        language
      });

      console.log("API response:", res.data);
      
      if (res.data?.results) {
        console.log("Setting test results:", res.data.results);
        setTestResults(res.data.results);
      } else {
        console.warn("No results in response:", res.data);
      }
    } catch (err) {
      console.error("Error running tests:", err);
      console.error("Error response:", err.response?.data);
      alert(err.response?.data?.message || err.message || "Error running tests");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    console.log("🔵 ProblemSolverPage handleSubmit called");
    
    if (!code.trim()) {
      console.warn("No code entered");
      alert("Please write some code first");
      return;
    }

    if (!isTimeExpired && !window.confirm("Are you sure you want to submit your solution?")) {
      return;
    }

    if (!problemId) {
      console.error("Problem ID is missing");
      alert("Error: Problem ID not found");
      return;
    }

    try {
      setSubmitting(true);

      const endpoint = eventId
        ? `/submissions/event/submit`
        : `/submissions/submit`;

      console.log("Attempting to submit", { endpoint, problemId, eventId });

      const res = await API.post(endpoint, {
        problemId,
        eventId: eventId || null,
        code,
        language
      });

      console.log("Submit response:", res.data);

      if (res.data?.submissionId || res.data?.success) {
        alert("Submission received! Your solution will be evaluated.");
        // Clear saved code
        localStorage.removeItem(`problem-code-${problemId}-${language}`);
        
        if (fromEventAttempt && eventId) {
          navigate(`/student/event/${eventId}/attempt`);
        } else {
          navigate("/student/problems");
        }
      } else {
        console.warn("No submissionId in response:", res.data);
      }
    } catch (err) {
      console.error("Error submitting solution:", err);
      console.error("Error response:", err.response?.data);
      alert(err.response?.data?.message || err.message || "Submission failed");
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
              if (fromEventAttempt && eventId) {
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
              if (fromEventAttempt && eventId) {
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
        {problemStartId && (
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
            if (fromEventAttempt && eventId) {
              navigate(`/student/event/${eventId}/attempt`);
            } else {
              navigate("/student/problems");
            }
          }}
        >
          ← Back
        </button>
      </div>

      {/* Time Warning Banner */}
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
          <CodeEditor
            code={code}
            setCode={handleCodeChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            onRunTests={runSampleTests}
            onSubmit={handleSubmit}
            loading={submitting}
            mode="problem"
            height="600px"
            showButtons={true}
            testResults={testResults}
            allowedLanguageIds={problem.allowedLanguages || [54, 50, 62, 63, 71]}
          />
        </div>
      </div>
    </div>
  );
};

export default ProblemSolverPage;
