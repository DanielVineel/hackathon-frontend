import React from "react";
import ProblemCard from "./ProblemCard";

const ProblemsGrid = ({ problems, onEdit, onDelete }) => {
  return (
    <div className="problems-grid">
      {problems.map((p) => (
        <ProblemCard
          key={p._id}
          problem={p}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProblemsGrid;