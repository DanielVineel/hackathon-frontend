import React from "react";

const ProblemCard = ({ problem, onEdit, onDelete }) => {
  return (
    <div className="problem-card">
      <h3>{problem.name}</h3>

      <span className={`level-${problem.level}`}>
        {problem.level}
      </span>

      <p>{problem.statement?.slice(0, 100)}...</p>

      <div>
        <button onClick={() => onEdit(problem)}>Edit</button>
        <button onClick={() => onDelete(problem._id)}>Delete</button>
      </div>
    </div>
  );
};

export default ProblemCard;