import React from "react";

const ProblemCard = ({ problem }) => {
  return (
    <div className="border p-2" style={{ width: "250px" }}>
      <h5>{problem.name}</h5>
      <p>{problem.description.slice(0, 100)}...</p>
    </div>
  );
};

export default ProblemCard;