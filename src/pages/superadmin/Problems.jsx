// src/pages/superadmin/Problems.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Problems = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    API.get("/superadmin/problems")
      .then(res=>setProblems(res.data))
      .catch(err=>console.log(err));
  }, []);

  return (
    <div>
      <h2>All Problems</h2>
      {problems.map(p=>(
        <div key={p._id} className="border p-2 mb-2">
          <h5>{p.name}</h5>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Problems;