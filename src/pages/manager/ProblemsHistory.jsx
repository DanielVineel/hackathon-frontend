import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { getToken } from "../../utils/auth";

const ProblemsHistory = () => {
  const [problems, setProblems] = useState([]);
  const [newProblem, setNewProblem] = useState({
    name: "",
    description: "",
    sampleTestCases: [],
    hiddenTestCases: [],
    score: 0,
    language: "javascript",
  });
  const [difficulty, setDifficulty] = useState("all");
  const token = getToken();

  const fetchProblems = async (diff) => {
    try {
      let url = "/manager/problems";
      if (diff !== "all") url += `?difficulty=${diff}`;

      const res = await API.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProblems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProblems(difficulty);
  }, [difficulty, token]);

  const handleAdd = () => {
    API.post("/manager/problems", newProblem, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setProblems([...problems, res.data]))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>Problems</h2>

      {/* Difficulty Filters - 4 options */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button onClick={() => setDifficulty("all")}>All</button>
        <button onClick={() => setDifficulty("easy")}>Easy</button>
        <button onClick={() => setDifficulty("medium")}>Medium</button>
        <button onClick={() => setDifficulty("hard")}>Hard</button>
      </div>

      <div className="mb-2">
        <input
          type="text"
          className="form-control mb-1"
          placeholder="Problem Name"
          value={newProblem.name}
          onChange={(e) => setNewProblem({ ...newProblem, name: e.target.value })}
        />
        <textarea
          className="form-control mb-1"
          placeholder="Description"
          value={newProblem.description}
          onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
        ></textarea>
        <input
          type="number"
          className="form-control mb-1"
          placeholder="Score"
          value={newProblem.score}
          onChange={(e) => setNewProblem({ ...newProblem, score: e.target.value })}
        />
      </div>

      <button className="btn btn-success mb-3" onClick={handleAdd}>
        Add Problem
      </button>

      <h5>Existing Problems</h5>
      {problems.length === 0 && <p>No problems found</p>}
      {problems.map((p) => (
        <div key={p._id} className="border p-2 mb-2">
          {p.name} - Score: {p.score}
        </div>
      ))}
    </div>
  );
};

export default ProblemsHistory;