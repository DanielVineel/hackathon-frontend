// src/pages/manager/Problems.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [newProblem, setNewProblem] = useState({ name: "", description: "", sampleTestCases: [], hiddenTestCases: [], score: 0, language: "javascript" });

  useEffect(() => {
    API.get("/manager/problems")
      .then(res => setProblems(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleAdd = () => {
    API.post("/manager/problems", newProblem)
      .then(res => setProblems([...problems, res.data]))
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Problems</h2>
      <div className="mb-2">
        <input type="text" className="form-control mb-1" placeholder="Problem Name" value={newProblem.name} onChange={e=>setNewProblem({...newProblem, name:e.target.value})}/>
        <textarea className="form-control mb-1" placeholder="Description" value={newProblem.description} onChange={e=>setNewProblem({...newProblem, description:e.target.value})}></textarea>
        <input type="number" className="form-control mb-1" placeholder="Score" value={newProblem.score} onChange={e=>setNewProblem({...newProblem, score:e.target.value})}/>
      </div>
      <button className="btn btn-success mb-3" onClick={handleAdd}>Add Problem</button>
      <h5>Existing Problems</h5>
      {problems.map(p => (
        <div key={p._id} className="border p-2 mb-2">{p.name} - Score: {p.score}</div>
      ))}
    </div>
  );
};

export default Problems;