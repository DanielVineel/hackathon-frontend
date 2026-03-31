import { useEffect, useState } from "react";
import API from "../../api/api";
import { getToken } from "../../utils/auth";
import { useGlobalLoader } from "../../hooks/useLoading";
import "../styles/common/Problems.css";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState("all");
  const token = getToken();
  const { showLoader, hideLoader } = useGlobalLoader();

  const fetchProblems = async (level) => {
    try {
      setLoading(true);
      showLoader("Loading problems...");
      setError(null);

      // Build query params
      const params = level !== "all" ? { level } : {};

      const res = await API.get("/problems", { params });

      // Handle different response structures
      let problemsData = [];
      if (res?.data) {
        if (Array.isArray(res.data)) {
          problemsData = res.data;
        } else if (Array.isArray(res.data.data)) {
          problemsData = res.data.data;
        } else if (Array.isArray(res.data.problems)) {
          problemsData = res.data.problems;
        }
      }

      setProblems(Array.isArray(problemsData) ? problemsData : []);
    } catch (err) {
      console.error("Error fetching problems:", err);
      const errorMsg = err.response?.data?.message || "Failed to load problems";
      setError(errorMsg);
      setProblems([]);
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  useEffect(() => {
    if (token) {
      fetchProblems(difficulty);
    }
  }, [difficulty, token]);

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  return (
    <div className="problems-container">
      <div className="problems-header">
        <h2>Problems</h2>
      </div>

      {/* Difficulty Filters */}
      <div className="problems-filters">
        <button
          className={`filter-btn ${difficulty === "all" ? "active" : ""}`}
          onClick={() => handleDifficultyChange("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${difficulty === "easy" ? "active" : ""}`}
          onClick={() => handleDifficultyChange("easy")}
        >
          Easy
        </button>
        <button
          className={`filter-btn ${difficulty === "medium" ? "active" : ""}`}
          onClick={() => handleDifficultyChange("medium")}
        >
          Medium
        </button>
        <button
          className={`filter-btn ${difficulty === "hard" ? "active" : ""}`}
          onClick={() => handleDifficultyChange("hard")}
        >
          Hard
        </button>
      </div>

      <hr />

      {/* Loading State */}
      {loading && <p className="loading-text">Loading problems...</p>}

      {/* Error State */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => fetchProblems(difficulty)}>Try Again</button>
        </div>
      )}

      {/* Empty State */}
      {!loading && problems.length === 0 && !error && (
        <p className="empty-text">No problems found</p>
      )}

      {/* Problems List */}
      {!loading && problems.length > 0 && (
        <div className="problems-list">
          {problems.map((problem) => (
            <div key={problem._id} className="problem-card">
              <div className="problem-header">
                <h3 className="problem-title">
                  {problem.name || problem.title}
                </h3>
                <span className={`difficulty-badge difficulty-${problem.level || problem.difficulty}`}>
                  {problem.level || problem.difficulty}
                </span>
              </div>

              {problem.statement && (
                <p className="problem-statement">
                  {problem.statement.substring(0, 150)}...
                </p>
              )}

              <div className="problem-meta">
                {problem.score && (
                  <span className="score">⭐ {problem.score} points</span>
                )}
               
              </div>

             
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Problems;