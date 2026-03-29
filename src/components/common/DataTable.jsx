/**
 * DataTable Component
 * Advanced table with sorting, filtering, pagination, bulk operations
 */

import React, { useState, useMemo } from 'react';
import './DataTable.css';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  error = null,
  selectable = false,
  actions = [],
  onRowClick = null,
  onBulkDelete = null,
  sortable = true,
  selectedRows = [],
  onSelectionChange = null
}) => {
  const [sortField, setSortField] = useState(columns[0]?.key || '');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRows_, setSelectedRows_] = useState(selectedRows);

  const sortedData = useMemo(() => {
    if (!sortable || !sortField) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return sorted;
  }, [data, sortField, sortOrder, sortable]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (e) => {
    const newSelection = e.target.checked
      ? data.map((_, idx) => idx)
      : [];
    setSelectedRows_(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectRow = (idx, e) => {
    e.stopPropagation();
    const newSelection = selectedRows_.includes(idx)
      ? selectedRows_.filter(i => i !== idx)
      : [...selectedRows_, idx];
    setSelectedRows_(newSelection);
    onSelectionChange?.(newSelection);
  };

  if (loading) {
    return <div className="data-table-loading">Loading...</div>;
  }

  if (error) {
    return <div className="data-table-error">Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div className="data-table-empty">No data available</div>;
  }

  return (
    <div className="data-table-wrapper">
      {selectedRows_.length > 0 && (
        <div className="bulk-actions-bar">
          <span>{selectedRows_.length} selected</span>
          {onBulkDelete && (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                if (window.confirm('Delete selected items?')) {
                  onBulkDelete(selectedRows_.map(idx => data[idx]._id));
                }
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            {selectable && (
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows_.length === data.length && data.length > 0}
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`${col.sortable ? 'sortable' : ''} ${col.hideOnMobile ? 'hide-mobile' : ''}`}
                style={col.width ? { width: col.width } : {}}
              >
                <div className="header-content">
                  {col.header || col.label}
                  {col.sortable && sortField === col.key && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {actions.length > 0 && <th className="actions-column">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr
              key={row._id || idx}
              onClick={() => onRowClick?.(row)}
              className={selectedRows_.includes(idx) ? 'selected' : ''}
            >
              {selectable && (
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedRows_.includes(idx)}
                    onChange={(e) => handleSelectRow(idx, e)}
                  />
                </td>
              )}
              {columns.map(col => (
                <td 
                  key={`${col.key}-${idx}`} 
                  data-label={col.header || col.label}
                  className={col.hideOnMobile ? 'hide-mobile' : ''}
                >
                  {col.render
                    ? col.render(row)
                    : row[col.key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="actions-cell">
                  <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                    {actions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        className={`action-btn ${action.className || ''}`}
                        onClick={() => action.onClick(row)}
                        title={action.label}
                      >
                        {action.icon || action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
