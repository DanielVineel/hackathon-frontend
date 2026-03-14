import React from "react";

const ProblemCard = ({ problem }) => {
  return (
    <div className="border p-2 problem-layout" style={{ }}>
        <div>{problem.name}</div>
        <div>{problem.level}</div>
        <div>solve problem</div>
    </div>
  );
};

export default ProblemCard;