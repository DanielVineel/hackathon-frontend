import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../../api/api";
import CodeEditor from "../../components/code-editor/CodeEditor";
import "../styles/student/EventProblemSolver.css";


/**
 * Event Problem Solver with 3-column layout
 * Left: Problem List | Middle: Problem Details | Right: Code Editor
 */
const EventProblemSolver = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const attemptId = location.state?.attemptId;

  // Data states
  const [eventData, setEventData] = useState(null);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Code editor states
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Timer states
  const [eventTimer, setEventTimer] = useState(null);
  const [isEventTimeExpired, setIsEventTimeExpired] = useState(false);

  // Problem start tracking
  const [problemStartId, setProblemStartId] = useState(null);
  const [problemRemainingTime, setProblemRemainingTime] = useState(0);

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
   * Fetch event and problems
   */
  const fetchEventAndProblems = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch event details
      const eventRes = await API.get(`/events/${eventId}`);
      setEventData(eventRes.data?.data || eventRes.data);

      // Fetch problems
      const problemsRes = await API.get(`/student/event/${eventId}/problems`);
      const problemList = problemsRes.data?.problems || problemsRes.data?.data || [];

      setProblems(problemList);

      // Select first problem
      if (problemList.length > 0) {
        setSelectedProblem(problemList[0]);
      }

      // Start event (creates EventSubmission record)
      await startEventSubmission();

      // Fetch event timer
      await fetchEventTimer();
    } catch (err) {
      console.error("Error fetching event:", err);
      setError(err.response?.data?.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Start event submission (creates EventSubmission record)
   */
  const startEventSubmission = async () => {
    try {
      const res = await API.post(`/submissions/events/${eventId}/start`);
      if (res.data?.success || res.data?.data?._id) {
        console.log("Event submission started");
      }
    } catch (err) {
      console.error("Error starting event submission:", err);
      // Continue anyway - user can still solve problems
    }
  };

  /**
   * Fetch event timer
   */
  const fetchEventTimer = async () => {
    try {
      const res = await API.get(`/student/event/${eventId}/timer`);
      setEventTimer({
        total: res.data?.total || 3600,
        remaining: res.data?.data?.remaining || 3600,
        started: true
      });
    } catch (err) {
      console.error("Error fetching timer:", err);
      // Fallback
      setEventTimer({ total: 3600, remaining: 3600, started: true });
    }
  };

  /**
   * Start solving a problem - uses ProblemSubmission model via backend
   */
  const startProblemSolving = async (problemId) => {
    try {
      const res = await API.post(
        `/submissions/events/${eventId}/problems/${problemId}/start`
      );

      if (res.data?.success) {
        setProblemStartId(res.data?.data?._id);
        // Default to 1 hour if no specific problem time limit
        setProblemRemainingTime(3600);
      }
    } catch (err) {
      console.error("Error starting problem:", err);
      // Continue anyway - user can still solve the problem
      setProblemRemainingTime(3600);
    }
  };

  /**
   * Handle selecting a problem from list
   */
  const selectProblem = async (problem) => {
    // Save code for previous problem
    if (selectedProblem) {
      localStorage.setItem(
        `event-problem-code-${eventId}-${selectedProblem._id}-${language}`,
        code
      );
    }

    setSelectedProblem(problem);

    // Load saved code for new problem
    const savedCode = localStorage.getItem(
      `event-problem-code-${eventId}-${problem._id}-${language}`
    );
    setCode(savedCode || "");

    // Start problem solving (creates ProblemSubmission record)
    if (!problemStartId) {
      await startProblemSolving(problem._id);
    }
  };

  /**
   * Event timer countdown
   */
  useEffect(() => {
    if (!eventTimer || eventTimer.remaining <= 0) return;

    const timer = setInterval(() => {
      setEventTimer(prev => {
        if (prev.remaining <= 1) {
          setIsEventTimeExpired(true);
          return { ...prev, remaining: 0 };
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [eventTimer]);

  /**
   * Problem timer countdown
   */
  useEffect(() => {
    if (!problemStartId || problemRemainingTime <= 0) return;

    const timer = setInterval(() => {
      setProblemRemainingTime(prev => {
        if (prev <= 1) {
          // Auto-submit when problem time expires
          if (code.trim()) {
            handleAutoSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [problemRemainingTime, problemStartId]);

  /**
   * Fetch event and problems on mount
   */
  useEffect(() => {
    fetchEventAndProblems();
  }, [eventId]);

  /**
   * Handle auto-submit when problem time expires
   */
  const handleAutoSubmit = async () => {
    if (submitting || !code.trim() || !selectedProblem) return;

    try {
      setSubmitting(true);

      const res = await API.post(`/submissions/event/submit`, {
        problemId: selectedProblem._id,
        eventId,
        code,
        language,
        autoSubmitted: true
      });

      if (res.data?.success || res.data?.submissionId) {
        alert("⏰ Problem time expired! Your solution has been automatically submitted.");
        localStorage.removeItem(
          `event-problem-code-${eventId}-${selectedProblem._id}-${language}`
        );

        // Auto-select next problem if available
        const currentIndex = problems.findIndex(p => p._id === selectedProblem._id);
        if (currentIndex < problems.length - 1) {
          await selectProblem(problems[currentIndex + 1]);
        }
      }
    } catch (err) {
      console.error("Auto-submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    // Save current code
    if (selectedProblem) {
      localStorage.setItem(
        `event-problem-code-${eventId}-${selectedProblem._id}-${language}`,
        code
      );

      // Load code for new language
      const savedCode = localStorage.getItem(
        `event-problem-code-${eventId}-${selectedProblem._id}-${newLanguage}`
      );
      setCode(savedCode || "");
    }
    setLanguage(newLanguage);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (selectedProblem) {
      localStorage.setItem(
        `event-problem-code-${eventId}-${selectedProblem._id}-${language}`,
        newCode
      );
    }
  };

  const runSampleTests = async () => {
    if (!code.trim() || !selectedProblem) {
      alert("Please write some code first");
      return;
    }

    try {
      setSubmitting(true);

      const res = await API.post(`/submissions/event/run`, {
        problemId: selectedProblem._id,
        eventId,
        code,
        language
      });

      if (res.data?.results || res.data?.success) {
        setTestResults(res.data.results || []);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error running tests");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim() || !selectedProblem) {
      alert("Please write some code first");
      return;
    }

    if (!window.confirm("Are you sure you want to submit your solution?")) {
      return;
    }

    try {
      setSubmitting(true);

      const res = await API.post(`/submissions/event/submit`, {
        problemId: selectedProblem._id,
        eventId,
        code,
        language
      });

      if (res.data?.success || res.data?.submissionId) {
        alert("Submission received! Your solution will be evaluated.");
        localStorage.removeItem(
          `event-problem-code-${eventId}-${selectedProblem._id}-${language}`
        );

        // Auto-select next problem if available
        const currentIndex = problems.findIndex(p => p._id === selectedProblem._id);
        if (currentIndex < problems.length - 1) {
          await selectProblem(problems[currentIndex + 1]);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="event-problem-solver loading">
        <div className="loader"></div>
        <p>Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-problem-solver error">
        <div className="error-message">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button
            className="btn-back"
            onClick={() => navigate("/student/events")}
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!selectedProblem) {
    return (
      <div className="event-problem-solver">
        <div className="error-message">
          <h2>No problems available</h2>
          <button
            className="btn-back"
            onClick={() => navigate("/student/events")}
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-problem-solver">
      {/* Event Header */}
      <div className="event-header">
        <div className="header-left">
          <h1>{eventData?.title}</h1>
          <span className="event-mode">EVENT</span>
        </div>
        <div className="header-timer">
          <div className={`timer ${eventTimer?.remaining < 300 ? "warning" : ""}`}>
            ⏱️ {formatTime(eventTimer?.remaining || 0)}
            {eventTimer?.remaining < 300 && eventTimer?.remaining > 0 && (
              <span className="timer-text">Event ending soon!</span>
            )}
          </div>
        </div>
        <button
          className="btn-exit"
          onClick={() => navigate("/student/events")}
        >
          Exit
        </button>
      </div>


        {/* Left Panel (top) - Problem List */}

      <div className="problems-panel">
          <div className="panel-header">
            <h2>Problems</h2>
            <span className="count">{problems.length}</span>
          </div>
          <div className="problems-list">
            {problems.map((problem) => (
              <button
                key={problem._id}
                className={`problem-item ${
                  selectedProblem._id === problem._id ? "active" : ""
                }`}
                onClick={() => selectProblem(problem)}
                title={problem.name || problem.title}
              >
                <span className="problem-number">{problems.indexOf(problem) + 1}</span>
                
              </button>
            ))}
          </div>
        </div>

      {/* Main Container - 3 Column Layout */}
      <div className="solver-layout">
        

        {/* Middle Panel - Problem Details */}
        <div className="details-panel">
          <div className="panel-header">
            <h2>{selectedProblem.name}</h2>
            <span className="points">⭐ {selectedProblem.score || 100} pts</span>
          </div>

          <div className="panel-content">
            <div className="problem-section">
              <h3>Description</h3>
              <p>{selectedProblem.description}</p>
            </div>

            {selectedProblem.sampleTestCases &&
              selectedProblem.sampleTestCases.length > 0 && (
                <div className="problem-section">
                  <h3>Sample Test Cases</h3>
                  {selectedProblem.sampleTestCases.map((testCase, idx) => (
                    <div key={`test-${idx}-${testCase.input?.substring(0, 10) || ''}`} className="test-case">
                      <div className="test-io">
                        <strong>Input:</strong>
                        <pre>{testCase.input || testCase.sampleInput}</pre>
                      </div>
                      <div className="test-io">
                        <strong>Expected Output:</strong>
                        <pre>{testCase.output || testCase.expectedOutput}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            <div className="problem-section">
              <h3>Constraints</h3>
              <p>Time Limit: {selectedProblem.timeLimit || 1}s</p>
              <p>Memory Limit: {selectedProblem.memoryLimit || 256}MB</p>
              {problemStartId && (
                <p className="problem-timer">
                  ⏱️ Problem Time: {formatTime(problemRemainingTime)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="editor-panel">
          <CodeEditor
            code={code}
            setCode={handleCodeChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            onRunTests={runSampleTests}
            onSubmit={handleSubmit}
            loading={submitting}
            mode="event"
            height="calc(100vh - 200px)"
            showButtons={true}
            testResults={testResults}
            allowedLanguageIds={selectedProblem.allowedLanguages || [54, 50, 62, 63, 71]}
          />
        </div>
      </div>
    </div>
  );
};

export default EventProblemSolver;
