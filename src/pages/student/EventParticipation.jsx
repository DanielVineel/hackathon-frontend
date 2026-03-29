import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { getUserData } from "../../utils/auth";
import "../../styles/EventParticipation.css";

const EventParticipation = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const user = getUserData();
  const [event, setEvent] = useState(null);
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const timerIntervalRef = useRef(null);
  const codeRef = useRef("");

  useEffect(() => {
    fetchEventData();
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [eventId]);

  useEffect(() => {
    // Save code to cache whenever it changes
    if (code) {
      const cacheKey = `code_${eventId}_${problems[currentProblemIndex]?._id}`;
      localStorage.setItem(cacheKey, code);
    }
  }, [code, eventId, currentProblemIndex, problems]);

  useEffect(() => {
    if (timeRemaining <= 0 && timerActive && event) {
      setTimerActive(false);
      autoSubmitAllCode();
      return;
    }

    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timeRemaining, timerActive, event]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const eventRes = await API.get(`/events/${eventId}`);
      setEvent(eventRes.data.data || eventRes.data);
      
      // Get event problems
      const problemsRes = await API.get(`/student/event/${eventId}/problems`);
      const eventProblems = problemsRes.data.data || [];
      setProblems(eventProblems);

      // Calculate duration and set timer
      const startTime = new Date(eventRes.data.data?.startDate || eventRes.data.startDate).getTime();
      const endTime = new Date(eventRes.data.data?.endDate || eventRes.data.endDate).getTime();
      const durationMs = endTime - startTime;
      setTimeRemaining(Math.floor(durationMs / 1000));

      // Load cached code if exists
      if (eventProblems.length > 0) {
        const cacheKey = `code_${eventId}_${eventProblems[0]._id}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setCode(cached);
          codeRef.current = cached;
        }
      }
    } catch (err) {
      console.log("Failed to load event data:", err);
    } finally {
      setLoading(false);
    }
  };

  const autoSubmitAllCode = async () => {
    const allSubmissions = [];
    
    for (let i = 0; i < problems.length; i++) {
      const cacheKey = `code_${eventId}_${problems[i]._id}`;
      const cachedCode = localStorage.getItem(cacheKey);
      
      if (cachedCode && cachedCode.trim()) {
        try {
          const res = await API.post(`/submissions/submit`, {
            eventId,
            problemId: problems[i]._id,
            code: cachedCode,
            language: "javascript"
          });
          
          allSubmissions.push({
            problemId: problems[i]._id,
            status: res.data.data?.status || "submitted",
            message: "Auto-submitted on time end"
          });
        } catch (err) {
          console.log(`Failed to submit problem ${i}:`, err);
        }
      }
    }

    setSubmissions(allSubmissions);
    setTimerActive(false);
  };

  const runCode = async () => {
    if (!code.trim()) {
      setOutput("Write some code first!");
      return;
    }

    try {
      const res = await API.post(`/submissions/run`, {
        code,
        language: "javascript"
      });
      setOutput(res.data.data?.output || "Execution complete");
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.message || "Execution failed"}`);
    }
  };

  const submitCurrentProblem = async () => {
    try {
      const res = await API.post(`/submissions/submit`, {
        eventId,
        problemId: problems[currentProblemIndex]._id,
        code,
        language: "javascript"
      });

      setSubmissions([...submissions, {
        problemId: problems[currentProblemIndex]._id,
        status: res.data.data?.status || "accepted",
        message: "Submitted successfully"
      }]);

      setOutput("✓ Code submitted successfully!");
    } catch (err) {
      setOutput(`✗ Submission failed: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  const moveToProblem = (index) => {
    // Save current code
    const cacheKey = `code_${eventId}_${problems[currentProblemIndex]._id}`;
    localStorage.setItem(cacheKey, code);

    // Load new problem's code
    setCurrentProblemIndex(index);
    const newCacheKey = `code_${eventId}_${problems[index]._id}`;
    const cached = localStorage.getItem(newCacheKey);
    setCode(cached || "");
    setOutput("");
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="event-participation-container"><p>Loading event...</p></div>;
  if (!event || problems.length === 0) return <div className="event-participation-container"><p>No problems found in this event</p></div>;

  const currentProblem = problems[currentProblemIndex];
  const currentSubmission = submissions.find(s => s.problemId === currentProblem._id);

  return (
    <div className="event-participation-container">
      <div className="participation-header">
        <h1>{event.title}</h1>
        <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
          <span className="timer-label">Time Remaining:</span>
          <span className={`timer-value ${timeRemaining === 0 ? 'expired' : ''}`}>
            {formatTime(timeRemaining)}
          </span>
          {timeRemaining === 0 && <span className="timer-status">Event Ended</span>}
        </div>
      </div>

      <div className="participation-content">
        {/* Problems Navigation */}
        <div className="problems-navigation">
          <h3>Problems ({problems.length})</h3>
          <div className="problem-buttons">
            {problems.map((prob, idx) => {
              const submitted = submissions.find(s => s.problemId === prob._id);
              return (
                <button
                  key={prob._id}
                  className={`problem-btn ${idx === currentProblemIndex ? 'active' : ''} ${submitted ? 'submitted' : ''}`}
                  onClick={() => moveToProblem(idx)}
                  disabled={timeRemaining === 0}
                >
                  <span>{idx + 1}</span>
                  {submitted && <span className="check-mark">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="participation-main">
          {/* Problem Description */}
          <div className="problem-description">
            <h2>{currentProblem.title}</h2>
            <div className="difficulty-badge">{currentProblem.level}</div>
            <div className="problem-content">
              <h4>Description</h4>
              <p>{currentProblem.description}</p>

              {currentProblem.constraints && (
                <>
                  <h4>Constraints</h4>
                  <p>{currentProblem.constraints}</p>
                </>
              )}

              {currentProblem.examples && (
                <>
                  <h4>Examples</h4>
                  {Array.isArray(currentProblem.examples) && currentProblem.examples.map((ex, idx) => (
                    <div key={idx} className="example">
                      <p><strong>Input:</strong> <code>{ex.input}</code></p>
                      <p><strong>Output:</strong> <code>{ex.output}</code></p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Code Editor */}
          <div className="code-editor-section">
            <div className="editor-header">
              <h3>Solution</h3>
              {currentSubmission && <span className="submission-status success">✓ Submitted</span>}
            </div>
            <textarea
              className="code-textarea"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                codeRef.current = e.target.value;
              }}
              placeholder="Write your code here..."
              disabled={timeRemaining === 0}
            />
            <div className="editor-buttons">
              <button 
                className="btn-run"
                onClick={runCode}
                disabled={timeRemaining === 0}
              >
                Run Code
              </button>
              <button 
                className="btn-submit"
                onClick={submitCurrentProblem}
                disabled={timeRemaining === 0 || currentSubmission}
              >
                {currentSubmission ? "✓ Submitted" : "Submit"}
              </button>
            </div>

            {/* Output */}
            {output && (
              <div className="output-section">
                <h4>Output</h4>
                <div className="output-box">
                  {output}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit All and Exit */}
        <div className="participation-actions">
          <button 
            className="btn-finish"
            onClick={autoSubmitAllCode}
            disabled={timeRemaining === 0 || submissions.length === problems.length}
          >
            Submit All & Finish
          </button>
          <button 
            className="btn-exit"
            onClick={() => navigate(`/student/event-history`)}
          >
            Exit Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventParticipation;
