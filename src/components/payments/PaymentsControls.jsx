import React from "react";

const PaymentsControls = ({ filtersState, setFiltersState, setCurrentPage }) => {
  const { searchTerm, sortBy, sortOrder } = filtersState;

  const update = (newState) => {
    setFiltersState((prev) => ({ ...prev, ...newState }));
    setCurrentPage(1);
  };

  return (
    <div className="payments-controls">
      <input
        value={searchTerm}
        placeholder="Search..."
        onChange={(e) => update({ searchTerm: e.target.value })}
      />

      <select
        value={sortBy}
        onChange={(e) => update({ sortBy: e.target.value })}
      >
        <option value="createdAt">Date</option>
        <option value="amount">Amount</option>
      </select>

      <button
        onClick={() =>
          update({ sortOrder: sortOrder === "asc" ? "desc" : "asc" })
        }
      >
        {sortOrder === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
};

export default PaymentsControls;