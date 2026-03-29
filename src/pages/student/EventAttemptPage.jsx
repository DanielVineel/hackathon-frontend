import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./EventAttemptPage.css";

const EventAttemptPage = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get attempt info from location state
  const attemptState = location.state || {};

  // Data states
  const [event, setEvent] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Timer states
  const [remainingTime, setRemainingTime] = useState(attemptState.remainingTime || 0);
  const [isExpired, setIsExpired] = useState(false);

  // Problem states
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [problemStatuses, setProblemStatuses] = useState({});

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  // Timer countdown
  useEffect(() => {
    if (remainingTime <= 0) {
      setIsExpired(true);
      handleEndEvent(true);
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          setTimeout(() => handleEndEvent(true), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch event details - the event should include problems
      const eventRes = await API.get(`/events/${eventId}`);
      const eventData = eventRes.data || eventRes.data.event;
      setEvent(eventData);

      // Fetch problems for the event
      try {
        const problemRes = await API.get(`/problems/event/${eventId}`);
        const problemsList = problemRes.data?.problems || [];
        setProblems(Array.isArray(problemsList) ? problemsList : []);
        
        if (problemsList.length > 0) {
          setSelectedProblem(problemsList[0]._id);
        }
      } catch (err) {
        console.log("Could not fetch event problems:", err);
        setProblems([]);
      }
    } catch (err) {
      console.error("Error fetching event data:", err);
      setError(err.response?.data?.message || "Failed to load event data");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSolveProblem = (problemId) => {
    navigate(`/student/problem/${problemId}`, {
      state: {
        eventId,
        attemptId: attemptState.attemptId,
        fromEventAttempt: true,
        remainingTime: remainingTime
      }
    });
  };

  const handleEndEvent = async (isAutoSubmit = false) => {
    if (!isAutoSubmit && !window.confirm("Are you sure you want to end the event attempt? You won't be able to submit after this.")) {
      return;
    }

    try {
      setLoading(true);
      await API.put(`/student/event/end/${eventId}`);
      
      if (isAutoSubmit || isExpired) {
        alert("⏰ Time expired! Your event attempt has been submitted.");
      } else {
        alert("Event attempt completed!");
      }
      
      navigate("/student/events");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to end event");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !event) {
    return (
      <div className="event-attempt-page loading">
        <div className="loader"></div>
        <p>Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-attempt-page error">
        <div className="error-message">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button className="btn-back" onClick={() => navigate("/student/events")}>
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-attempt-page">
        <div className="error-message">
          <h2>Event not found</h2>
          <button className="btn-back" onClick={() => navigate("/student/events")}>
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  const timerColor = remainingTime < 600 ? "timer-warning" : "";

  return (
    <div className="event-attempt-page">
      {/* Top Bar */}
      <div className="attempt-top-bar">
        <div className="event-info">
          <h1>{event.name || event.title}</h1>
          <p>Event Attempt in Progress</p>
        </div>

        <div className={`timer ${timerColor}`}>
          <span className="timer-label">Time Remaining</span>
          <span className="timer-display">{formatTime(remainingTime)}</span>
          {isExpired && <p className="timer-expired">⚠️ Time's Up!</p>}
        </div>

        <button
          className="btn btn-danger"
          onClick={handleEndEvent}
          disabled={loading || isExpired}
        >
          End Event
        </button>
      </div>

      <div className="attempt-container">
        {/* Problems Sidebar */}
        <div className="problems-sidebar">
          <h2>Problems ({problems.length})</h2>

          {problems.length > 0 ? (
            <div className="problems-list">
              {problems.map((problem) => (
                <button
                  key={problem._id}
                  className={`problem-item ${selectedProblem === problem._id ? "active" : ""}`}
                  onClick={() => handleSolveProblem(problem._id)}
                >
                  <div className="problem-number">
                    {problems.indexOf(problem) + 1}
                  </div>
                  <div className="problem-info">
                    <div className="problem-title">
                      {problem.title || problem.name}
                    </div>
                    <div className="problem-difficulty">
                      {problem.difficulty || problem.level || "Easy"}
                    </div>
                  </div>
                  <div className="problem-status">
                    {problemStatuses[problem._id] === "submitted" && (
                      <span className="status-badge submitted">✓</span>
                    )}
                    {problemStatuses[problem._id] === "attempted" && (
                      <span className="status-badge attempted">⏳</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-problems">
              <p>No problems in this event</p>
            </div>
          )}

          <button
            className="btn btn-secondary btn-block"
            onClick={handleEndEvent}
            disabled={loading || isExpired}
          >
            End Event
          </button>
        </div>

        {/* Main Content */}
        <div className="attempt-content">
          {selectedProblem && problems.length > 0 ? (
            <div className="problem-detail">
              <h2>Select a Problem to Solve</h2>
              <p>Click on a problem from the sidebar to start solving.</p>

              <div className="problem-preview">
                {problems
                  .filter(p => p._id === selectedProblem)
                  .map(problem => (
                    <div key={problem._id}>
                      <h3>{problem.title || problem.name}</h3>
                      <p className="problem-statement">{problem.description}</p>

                      <div className="problem-meta">
                        <span className="meta-item">
                          Difficulty: {problem.difficulty || problem.level || "Easy"}
                        </span>
                        <span className="meta-item">
                          Points: {problem.score || 100}
                        </span>
                      </div>

                      <button
                        className="btn btn-primary btn-lg"
                        onClick={() => handleSolveProblem(problem._id)}
                      >
                        👨‍💻 Start Solving
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ) : problems.length === 0 ? (
            <div className="no-problems">
              <p>No problems available for this event</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EventAttemptPage;
