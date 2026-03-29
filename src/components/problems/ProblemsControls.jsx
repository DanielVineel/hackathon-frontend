import React from "react";

const ProblemsControls = ({ filters, setFilters, events }) => {
  const update = (newData) => {
    setFilters((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div className="filters-section">
      
      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search problems..."
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
        className="filter-input"
      />

      {/* Event */}
      <select
        value={filters.event}
        onChange={(e) => update({ event: e.target.value })}
        className="filter-select"
      >
        <option value="all">All Events</option>
        {events.map((e) => (
          <option key={e._id} value={e._id}>
            {e.name}
          </option>
        ))}
      </select>

      {/* Level */}
      <select
        value={filters.level}
        onChange={(e) => update({ level: e.target.value })}
        className="filter-select"
      >
        <option value="all">All Levels</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* Sort */}
      <select
        value={filters.sortBy}
        onChange={(e) => update({ sortBy: e.target.value })}
      >
        <option value="name">Name</option>
        <option value="difficulty">Difficulty</option>
        <option value="score">Points</option>
      </select>

      <button
        onClick={() =>
          update({
            sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
          })
        }
      >
        {filters.sortOrder === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
};

export default ProblemsControls;