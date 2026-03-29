import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";
import { useApi } from "../../hooks/useApi";
import { useFilter } from "../../hooks/useFilter";
import { usePagination } from "../../hooks/usePagination";
import API from "../../api/api";
import "../../styles/EnhancedPages.css";

/**
 * ManagerRegistrations Component
 * Manage event registrations with filtering, search, and bulk actions
 */
const ManagerRegistrations = () => {
  const navigate = useNavigate();
  const { data: registrations, loading, error, refetch } = useApi("/manager/registrations");
  const { data: events } = useApi("/manager/events");
  
  const { filters, updateFilter, resetFilters } = useFilter({
    eventId: "",
    status: "",
    searchTerm: ""
  });

  const { currentPage, pageSize, totalPages, paginatedData, goToPage } = usePagination(registrations || [], 10);

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("registeredAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Apply filters
  const filteredRegistrations = React.useMemo(() => {
    let filtered = [...(registrations || [])];

    if (filters.eventId) {
      filtered = filtered.filter(r => r.eventId === filters.eventId);
    }
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.studentName?.toLowerCase().includes(term) ||
        r.email?.toLowerCase().includes(term) ||
        r.phone?.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [registrations, filters, sortBy, sortOrder]);

  const columns = [
    { 
      key: "checkbox", 
      label: "Select", 
      width: "5%", 
      render: (_, row) => (
        <input 
          type="checkbox" 
          checked={selectedRegistrations.includes(row._id)}
          onChange={() => handleSelectRegistration(row._id)}
        />
      )
    },
    { key: "studentName", label: "Student Name", width: "18%" },
    { key: "email", label: "Email", width: "18%" },
    { key: "phone", label: "Phone", width: "12%" },
    { key: "organization", label: "Organization", width: "15%" },
    { key: "status", label: "Status", width: "10%", render: (val) => (
      <span className={`status-badge status-${val?.toLowerCase()}`}>{val || "Pending"}</span>
    )},
    { key: "registeredAt", label: "Registered", width: "12%", render: (val) => new Date(val).toLocaleDateString() },
    { key: "actions", label: "Actions", width: "14%", render: (_, row) => (
      <div className="action-buttons compact">
        <button 
          className="btn btn-sm btn-primary"
          onClick={() => handleViewDetails(row)}
          title="View Details"
        >
          👁️
        </button>
        <button 
          className="btn btn-sm btn-warning"
          onClick={() => handleEditRegistration(row)}
          title="Edit"
        >
          ✏️
        </button>
        <button 
          className="btn btn-sm btn-danger"
          onClick={() => handleDeleteClick(row)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    )},
  ];

  const handleSelectRegistration = (id) => {
    if (selectedRegistrations.includes(id)) {
      setSelectedRegistrations(selectedRegistrations.filter(r => r !== id));
    } else {
      setSelectedRegistrations([...selectedRegistrations, id]);
    }
  };

  const handleViewDetails = (registration) => {
    setModalData(registration);
    setShowModal(true);
  };

  const handleEditRegistration = (registration) => {
    navigate(`/manager/registrations/${registration._id}/edit`);
  };

  const handleDeleteClick = (registration) => {
    setConfirmAction(() => () => handleDeleteRegistration(registration._id));
    setShowConfirm(true);
  };

  const handleDeleteRegistration = async (id) => {
    try {
      await API.delete(`/manager/registrations/${id}`);
      refetch();
      setShowConfirm(false);
    } catch (err) {
      console.error("Error deleting registration:", err);
    }
  };

  const handleBulkStatusChange = async (status) => {
    try {
      await API.post("/manager/registrations/bulk-update", {
        ids: selectedRegistrations,
        status
      });
      setSelectedRegistrations([]);
      refetch();
    } catch (err) {
      console.error("Error updating registrations:", err);
    }
  };

  const getStatusStats = () => {
    const stats = { total: registrations?.length || 0 };
    registrations?.forEach(r => {
      stats[r.status] = (stats[r.status] || 0) + 1;
    });
    return stats;
  };

  const stats = React.useMemo(() => getStatusStats(), [registrations]);

  return (
    <div className="enhanced-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>👥 Event Registrations</h1>
          <p>Manage student registrations for your events</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/manager/registrations/new")}>
          ➕ Add Registration
        </button>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Registrations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats["Confirmed"] || 0}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats["Pending"] || 0}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats["Cancelled"] || 0}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRegistrations.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedRegistrations.length} selected</span>
          <button className="btn btn-sm btn-success" onClick={() => handleBulkStatusChange("Confirmed")}>
            Confirm Selected
          </button>
          <button className="btn btn-sm btn-warning" onClick={() => handleBulkStatusChange("Pending")}>
            Mark Pending
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => setSelectedRegistrations([])}>
            Clear Selection
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="filter-section">
        <button 
          className={`btn btn-outline ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          🔍 {showFilters ? "Hide" : "Show"} Filters
        </button>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-row">
              <div className="filter-group">
                <label>Search</label>
                <input 
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter("searchTerm", e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Event</label>
                <select 
                  value={filters.eventId}
                  onChange={(e) => updateFilter("eventId", e.target.value)}
                >
                  <option value="">All Events</option>
                  {events?.map(event => (
                    <option key={event._id} value={event._id}>{event.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select 
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button 
                className="btn btn-secondary"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="content-area">
        {loading && <div className="loading">Loading registrations...</div>}
        {error && <div className="error-message">⚠️ {error}</div>}
        
        {!loading && filteredRegistrations.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No Registrations</h3>
            <p>No event registrations match your filters</p>
            <button className="btn btn-primary" onClick={resetFilters}>
              Clear Filters
            </button>
          </div>
        )}

        {!loading && filteredRegistrations.length > 0 && (
          <>
            <DataTable 
              columns={columns} 
              data={paginatedData}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={(key) => {
                if (key === "checkbox") return;
                if (sortBy === key) {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy(key);
                  setSortOrder("asc");
                }
              }}
            />
            
            {totalPages > 1 && (
              <div className="pagination-area">
                <div className="pagination-info">
                  Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredRegistrations.length)} of {filteredRegistrations.length}
                </div>
                <div className="pagination-controls">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => goToPage(1)}
                  >
                    First
                  </button>
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={currentPage === page ? "active" : ""}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(totalPages)}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Details Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Registration Details"
      >
        {modalData && (
          <div className="modal-content">
            <div className="details-row">
              <span className="label">Student Name:</span>
              <span>{modalData.studentName}</span>
            </div>
            <div className="details-row">
              <span className="label">Email:</span>
              <span>{modalData.email}</span>
            </div>
            <div className="details-row">
              <span className="label">Phone:</span>
              <span>{modalData.phone}</span>
            </div>
            <div className="details-row">
              <span className="label">Organization:</span>
              <span>{modalData.organization}</span>
            </div>
            <div className="details-row">
              <span className="label">Status:</span>
              <span className={`status-badge status-${modalData.status?.toLowerCase()}`}>{modalData.status}</span>
            </div>
            <div className="details-row">
              <span className="label">Registered At:</span>
              <span>{new Date(modalData.registeredAt).toLocaleString()}</span>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => handleEditRegistration(modalData)}>
                Edit Registration
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onConfirm={confirmAction}
        onCancel={() => setShowConfirm(false)}
        title="Delete Registration"
        message="Are you sure you want to delete this registration? This action cannot be undone."
      />
    </div>
  );
};

export default ManagerRegistrations;
