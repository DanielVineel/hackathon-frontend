// src/pages/student/Problems.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import ProblemCard from "../../components/common/ProblemCard";

const Problems = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    API.get("/problems")
      .then(res => setProblems(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>All Problems</h2>
      <div className="d-flex flex-wrap gap-3">
        {problems.map(p => <ProblemCard key={p._id} problem={p} />)}
      </div>
    </div>
  );
};

export default Problems;