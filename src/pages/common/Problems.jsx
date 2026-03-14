import { useEffect, useState } from "react";
import API from "../../api/api";
import { getToken } from "../../utils/auth";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState("all");
  const token = getToken();

  const fetchProblems = async (diff) => {
    try {
      let url = "/problems";
      if (diff !== "all") {
        url += `?difficulty=${diff}`;
      }

      const res = await API.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProblems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProblems(difficulty);
  }, [difficulty, token]);

  return (
    <div>
      <h2>Problems</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setDifficulty("all")}>All</button>
        <button onClick={() => setDifficulty("easy")}>Easy</button>
        <button onClick={() => setDifficulty("medium")}>Medium</button>
        <button onClick={() => setDifficulty("hard")}>Hard</button>
      </div>

      <hr />

      {/* Problems List */}
      <div>
        {problems.length === 0 && <p>No problems found</p>}

        {problems.map((problem) => (
          <div
            key={problem._id}
            style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}
          >
            <h3>{problem.title}</h3>
            <p>Difficulty: {problem.difficulty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems;