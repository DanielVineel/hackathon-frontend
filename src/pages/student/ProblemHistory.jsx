import React, { useEffect, useState } from "react";
import API from "../../api/api";

const ProblemHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    API.get("/student/problems/history")
      .then(res => setHistory(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Problem Solving History</h2>
      {history.map(h => <div key={h._id} className="border p-2 mb-2">{h.problemName} - Score: {h.score}</div>)}
    </div>
  );
};

export default ProblemHistory;