import React, { useState } from "react";
import "./FilterPanel.css";

/**
 * Reusable Filter Panel Component
 * Handles multiple filter types: text search, select dropdowns, date ranges, checkboxes
 */
const FilterPanel = ({
  filters,
  onFilterChange,
  onClearFilters,
  isOpen = false,
  onToggle,
}) => {
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (filterKey, value) => {
    const updatedFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.values(activeFilters).some((v) => v);

  return (
    <div className="filter-panel-wrapper">
      <button
        className="filter-toggle-btn"
        onClick={onToggle}
        aria-label="Toggle filters"
      >
        <span className="filter-icon">⚙️</span>
        Filters
        {hasActiveFilters && (
          <span className="filter-badge">{Object.keys(activeFilters).length}</span>
        )}
      </button>

      {isOpen && (
        <div className="filter-panel">
          <div className="filter-panel-header">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <button
                className="clear-filters-btn"
                onClick={handleClearFilters}
                title="Clear all filters"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="filter-panel-content">
            {filters.map((filter) => (
              <div key={filter.key} className="filter-group">
                <label className="filter-label">{filter.label}</label>

                {filter.type === "text" && (
                  <input
                    type="text"
                    placeholder={filter.placeholder || "Search..."}
                    className="filter-input"
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                  />
                )}

                {filter.type === "select" && (
                  <select
                    className="filter-select"
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === "multiselect" && (
                  <div className="filter-checkbox-group">
                    {filter.options?.map((opt) => (
                      <label key={opt.value} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={
                            Array.isArray(activeFilters[filter.key])
                              ? activeFilters[filter.key].includes(opt.value)
                              : false
                          }
                          onChange={(e) => {
                            let newValue = activeFilters[filter.key] || [];
                            if (!Array.isArray(newValue)) newValue = [];

                            if (e.target.checked) {
                              newValue = [...newValue, opt.value];
                            } else {
                              newValue = newValue.filter((v) => v !== opt.value);
                            }

                            handleFilterChange(filter.key, newValue);
                          }}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === "date" && (
                  <input
                    type="date"
                    className="filter-input"
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                  />
                )}

                {filter.type === "daterange" && (
                  <div className="filter-daterange">
                    <input
                      type="date"
                      className="filter-input filter-input-small"
                      placeholder="Start Date"
                      value={activeFilters[`${filter.key}_start`] || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          `${filter.key}_start`,
                          e.target.value
                        )
                      }
                    />
                    <span className="daterange-separator">to</span>
                    <input
                      type="date"
                      className="filter-input filter-input-small"
                      placeholder="End Date"
                      value={activeFilters[`${filter.key}_end`] || ""}
                      onChange={(e) =>
                        handleFilterChange(`${filter.key}_end`, e.target.value)
                      }
                    />
                  </div>
                )}

                {filter.type === "range" && (
                  <div className="filter-range">
                    <input
                      type="number"
                      className="filter-input filter-input-small"
                      placeholder="Min"
                      min={filter.min}
                      max={filter.max}
                      value={activeFilters[`${filter.key}_min`] || ""}
                      onChange={(e) =>
                        handleFilterChange(`${filter.key}_min`, e.target.value)
                      }
                    />
                    <span className="range-separator">-</span>
                    <input
                      type="number"
                      className="filter-input filter-input-small"
                      placeholder="Max"
                      min={filter.min}
                      max={filter.max}
                      value={activeFilters[`${filter.key}_max`] || ""}
                      onChange={(e) =>
                        handleFilterChange(`${filter.key}_max`, e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
