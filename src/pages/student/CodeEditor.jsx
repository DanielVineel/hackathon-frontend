import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import API from "../../api/api";
import CodeEditor from "../../components/code-editor/CodeEditor";
import "../styles/student/CodeEditor.css";

const StudentCodeEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { problemId, eventId } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Type and mode detection
  const type = location.state?.type || "problem"; // problem | event | practice | contest | event-intro
  const [timer, setTimer] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [userSubmissionCount, setUserSubmissionCount] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [problemSequence, setProblemSequence] = useState(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [constraints, setConstraints] = useState(null);

  useEffect(() => {
    fetchProblem();
    if (["event", "contest", "event-intro"].includes(type)) {
      fetchEventData();
      if (["event", "contest"].includes(type)) {
        startTimer();
      }
    }
    if (["event", "contest"].includes(type)) {
      fetchLeaderboard();
    }
  }, [problemId, eventId, type]);

  // Timer effect for events/contests
  useEffect(() => {
    if (!timer || timer.remaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimer(prev => ({
        ...prev,
        remaining: Math.max(0, prev.remaining - 1)
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timer]);

  const fetchProblem = async () => {
    try {
      let endpoint = `/problems/${problemId}`;
      
      if (type === "event" || type === "contest") {
        endpoint = `/student/event/${eventId}/problem/${problemId}`;
      } else if (type === "practice") {
        endpoint = `/student/practice/problem/${problemId}`;
      }
      
      const res = await API.get(endpoint);
      setProblem(res.data?.data);
      setCode(res.data?.data?.template || "");
      
      // Set constraints based on type
      setConstraints({
        totalAttempts: res.data?.data?.maxAttempts || (type === "contest" ? 1 : 10),
        timeLimit: res.data?.data?.timeLimit || 1,
        memoryLimit: res.data?.data?.memoryLimit || 256,
        type: type
      });
      
      setUserSubmissionCount(res.data?.data?.userAttempts || 0);
    } catch (err) {
      alert("Error loading problem");
    } finally {
      setLoading(false);
    }
  };

  const fetchEventData = async () => {
    try {
      const res = await API.get(`/student/event/${eventId}`);
      setEventData(res.data?.data);
      
      if (res.data?.data?.problems) {
        setProblemSequence(res.data.data.problems);
      }
    } catch (err) {
      console.error("Error loading event data", err);
    }
  };

  const startTimer = async () => {
    try {
      const res = await API.get(`/student/event/${eventId}/timer`);
      const remainingSeconds = res.data?.data?.remaining || 3600;
      setTimer({
        total: res.data?.data?.total || 3600,
        remaining: remainingSeconds,
        started: true
      });
    } catch (err) {
      // Fallback to 1 hour
      setTimer({ total: 3600, remaining: 3600, started: true });
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get(`/student/event/${eventId}/leaderboard`);
      setLeaderboard(res.data?.data || []);
    } catch (err) {
      console.error("Error loading leaderboard", err);
    }
  };

  const handleRunTests = async () => {
    if (type === "contest" && constraints?.totalAttempts === 1 && userSubmissionCount > 0) {
      alert("Contests only allow 1 submission! Use practice mode to test.");
      return;
    }

    try {
      setSubmitting(true);
      let endpoint = `/submissions/run`;
      
      if (type === "event" || type === "contest") {
        endpoint = `/submissions/event/run`;
      }
      
      const res = await API.post(endpoint, {
        problemId,
        eventId: type === "event" || type === "contest" ? eventId : undefined,
        code,
        language,
      });
      setTestResults(res.data?.results);
      setShowResults(true);
    } catch (err) {
      alert("Error running tests: " + (err.response?.data?.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    // Check constraints
    const remainingAttempts = constraints?.totalAttempts - userSubmissionCount;
    
    if (type === "contest" && remainingAttempts <= 0) {
      alert("No attempts remaining!");
      return;
    }

    if (type === "event-intro") {
      alert("Cannot submit in event intro mode!");
      return;
    }

    try {
      setSubmitting(true);
      let endpoint = `/submissions/submit`;
      
      if (type === "event" || type === "contest") {
        endpoint = `/submissions/event/submit`;
      } else if (type === "practice") {
        endpoint = `/submissions/practice/submit`;
      }
      
      const res = await API.post(endpoint, {
        problemId,
        eventId: type === "event" || type === "contest" ? eventId : undefined,
        code,
        language,
      });
      
      const score = res.data?.data?.score || 0;
      setUserScore(score);
      setUserSubmissionCount(prev => prev + 1);
      
      alert(`Solution submitted! Score: ${score} points`);
      
      // If more problems, navigate to next
      if (problemSequence && currentProblemIndex < problemSequence.length - 1) {
        const nextProblem = problemSequence[currentProblemIndex + 1];
        setCurrentProblemIndex(prev => prev + 1);
        navigate(`/student/event/${eventId}/problem/${nextProblem.id}`, {
          state: { type }
        });
      } else {
        navigate(type === "contest" ? "/student/contests" : "/student/submissions");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting solution");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextProblem = () => {
    if (problemSequence && currentProblemIndex < problemSequence.length - 1) {
      const nextProblem = problemSequence[currentProblemIndex + 1];
      setCurrentProblemIndex(prev => prev + 1);
      navigate(`/student/event/${eventId}/problem/${nextProblem.id}`, {
        state: { type }
      });
    }
  };

  const handlePreviousProblem = () => {
    if (currentProblemIndex > 0) {
      const prevProblem = problemSequence[currentProblemIndex - 1];
      setCurrentProblemIndex(prev => prev - 1);
      navigate(`/student/event/${eventId}/problem/${prevProblem.id}`, {
        state: { type }
      });
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <div className="code-editor-loading">Loading editor...</div>;
  if (!problem) return <div className="code-editor-error">Problem not found</div>;

  return (
    <div className={`code-editor-container type-${type}`}>
      {/* TOP BAR - Mode Info & Timer */}
      {["event", "contest", "event-intro"].includes(type) && (
        <div className="code-editor-topbar">
          <div className="topbar-left">
            <span className={`mode-badge mode-${type}`}>{type.toUpperCase()}</span>
            {eventData && <h3>{eventData.title}</h3>}
          </div>
          <div className="topbar-center">
            {problemSequence && (
              <span className="problem-counter">
                Problem {currentProblemIndex + 1} of {problemSequence.length}
              </span>
            )}
          </div>
          <div className="topbar-right">
            {timer && timer.started && (
              <div className={`timer ${timer.remaining < 300 ? "timer-warning" : ""}`}>
                ⏱️ {formatTime(timer.remaining)}
              </div>
            )}
            {type === "contest" && (
              <div className="score-display">
                📊 Score: <strong>{userScore}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="code-editor-main">
        {/* Left Panel - Problem Description */}
        <div className="left-panel">
          <div className="panel-header">
            <div className="header-title">
              <h2>{problem.name}</h2>
              <span className={`difficulty ${problem.difficulty}`}>
                {problem.difficulty}
              </span>
            </div>
            {type === "event" && (
              <div className="header-meta">
                <span className="points">⭐ {problem.points || "?"} pts</span>
              </div>
            )}
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
              <p>Time Limit: {constraints?.timeLimit || 1} second</p>
              <p>Memory Limit: {constraints?.memoryLimit || 256} MB</p>
            </div>

            {/* Type-specific additional info */}
            {(type === "event" || type === "contest") && (
              <div className="problem-section constraints-info">
                <h3>Submission Info</h3>
                <p>Attempts: {userSubmissionCount + 1} / {constraints?.totalAttempts}</p>
                {type === "contest" && constraints?.totalAttempts === 1 && (
                  <p className="warning">⚠️ Contest: Only 1 submission allowed!</p>
                )}
              </div>
            )}

            {type === "event-intro" && (
              <div className="problem-section event-intro-info">
                <h3>Event Information</h3>
                <p>{eventData?.description}</p>
                <p>Start solving problems when ready →</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="right-panel">
          <div className="editor-toolbar">
            <div className="toolbar-left">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            <div className="toolbar-center">
              {problemSequence && problemSequence.length > 1 && (
                <div className="nav-buttons">
                  <button 
                    onClick={handlePreviousProblem}
                    disabled={currentProblemIndex === 0}
                    className="btn-nav"
                  >
                    ← Previous
                  </button>
                  <button 
                    onClick={handleNextProblem}
                    disabled={currentProblemIndex === problemSequence.length - 1}
                    className="btn-nav"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
            <div className="toolbar-right">
              {type !== "event-intro" && (
                <>
                  <button
                    className="btn-run"
                    onClick={handleRunTests}
                    disabled={submitting}
                    title={type === "contest" && userSubmissionCount > 0 ? "Contests don't allow test runs" : ""}
                  >
                    ▶ Run Tests
                  </button>
                  <button
                    className="btn-submit"
                    onClick={handleSubmit}
                    disabled={submitting || (type === "event-intro")}
                  >
                    ✓ Submit
                  </button>
                </>
              )}
              <button
                className="btn-exit"
                onClick={() => navigate(-1)}
              >
                ✕ Exit
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

      {/* Bottom Panel - Leaderboard (for events/contests) */}
      {["event", "contest"].includes(type) && leaderboard && leaderboard.length > 0 && (
        <div className="code-editor-leaderboard">
          <h3>🏆 Live Leaderboard</h3>
          <div className="leaderboard-list">
            {leaderboard.slice(0, 5).map((entry, idx) => (
              <div key={idx} className="leaderboard-entry">
                <span className="rank">#{idx + 1}</span>
                <span className="name">{entry.username}</span>
                <span className="points">{entry.score} pts</span>
                <span className="problems">{entry.problemsSolved} solved</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCodeEditor;
