// src/pages/superadmin/Users.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import "../../styles/EnhancedPages.css";
import "./Users.css";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    role: "all",
    status: "all"
  });

  // Bulk operations
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActionMenu, setShowBulkActionMenu] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentsRes, managersRes] = await Promise.all([
        API.get("/students"),
        API.get("/managers")
      ]);

      const allUsers = [
        ...(studentsRes.data?.data || []).map(s => ({
          ...s,
          role: "Student",
          status: s.status || "active",
          joinedDate: s.createdAt || new Date().toISOString()
        })),
        ...(managersRes.data?.data || []).map(m => ({
          ...m,
          role: "Manager",
          status: m.status || "active",
          joinedDate: m.createdAt || new Date().toISOString()
        }))
      ];

      setUsers(allUsers);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered and sorted data
  const filteredData = React.useMemo(() => {
    let filtered = [...users];

    // Apply filters
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.includes(term)
      );
    }

    if (filters.role !== "all") {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const stats = React.useMemo(() => ({
    total: users.length,
    students: users.filter(u => u.role === "Student").length,
    managers: users.filter(u => u.role === "Manager").length,
    active: users.filter(u => u.status === "active").length
  }), [users]);

  // Handlers
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(paginatedData.map(u => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleEdit = (user) => {
    navigate(`/superadmin/users/edit/${user._id}`);
  };

  const handleDelete = (user) => {
    setDeleteTarget(user);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/${deleteTarget.role.toLowerCase()}s/${deleteTarget._id}`);
      setUsers(users.filter(u => u._id !== deleteTarget._id));
      setShowConfirmDelete(false);
      setDeleteTarget(null);
    } catch (err) {
      setError("Failed to delete user. Please try again.");
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      await Promise.all(
        selectedUsers.map(userId => {
          const user = users.find(u => u._id === userId);
          return API.put(`/${user.role.toLowerCase()}s/${userId}`, { status: newStatus });
        })
      );
      
      setUsers(users.map(u =>
        selectedUsers.includes(u._id) ? { ...u, status: newStatus } : u
      ));
      setSelectedUsers([]);
      setShowBulkActionMenu(false);
    } catch (err) {
      setError("Failed to update users. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedUsers.map(userId => {
          const user = users.find(u => u._id === userId);
          return API.delete(`/${user.role.toLowerCase()}s/${userId}`);
        })
      );

      setUsers(users.filter(u => !selectedUsers.includes(u._id)));
      setSelectedUsers([]);
      setShowBulkActionMenu(false);
    } catch (err) {
      setError("Failed to delete users. Please try again.");
    }
  };

  // Table columns
  const columns = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedUsers.length === paginatedData.length && paginatedData.length > 0}
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(row._id)}
          onChange={() => handleSelectUser(row._id)}
        />
      ),
      width: "50px"
    },
    {
      key: "name",
      header: "Name",
      render: (value, row) => (
        <div>
          <strong>{row.name}</strong>
          <br />
          <small style={{ color: "#6b7280" }}>{row.email}</small>
        </div>
      ),
      sortable: true
    },
    {
      key: "phone",
      header: "Phone",
      render: (value) => value || "N/A",
      sortable: true
    },
    {
      key: "role",
      header: "Role",
      render: (value) => (
        <span className={`status-badge ${value === "Student" ? "role-student" : "role-manager"}`}>
          {value}
        </span>
      ),
      sortable: true
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <span className={`status-badge status-${value}`}>
          {value === "active" ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true
    },
    {
      key: "joinedDate",
      header: "Joined",
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="action-buttons compact">
          <button className="btn btn-sm btn-primary" onClick={() => handleView(row)} title="View Details">
            👁️
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(row)} title="Edit">
            ✏️
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row)} title="Delete">
            🗑️
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="enhanced-page Users">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>👥 Users Management</h1>
          <p>Manage all system users and their roles</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.students}</span>
          <span className="stat-label">Students</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.managers}</span>
          <span className="stat-label">Managers</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label">Active Users</span>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedUsers.length} selected</span>
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleBulkStatusChange("active")}
          >
            ✓ Activate
          </button>
          <button
            className="btn btn-sm btn-warning"
            onClick={() => handleBulkStatusChange("inactive")}
          >
            ⊘ Deactivate
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={handleBulkDelete}
          >
            🗑️ Delete Selected
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setSelectedUsers([])}
          >
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
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-row">
              <div className="filter-group">
                <label>Search by Name, Email or Phone</label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.searchTerm}
                  onChange={(e) => {
                    setFilters({ ...filters, searchTerm: e.target.value });
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="filter-group">
                <label>Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => {
                    setFilters({ ...filters, role: e.target.value });
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="Student">Students</option>
                  <option value="Manager">Managers</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => {
                    setFilters({ ...filters, status: e.target.value });
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFilters({ searchTerm: "", role: "all", status: "all" });
                  setCurrentPage(1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="content-area">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No users found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paginatedData}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />

            {/* Pagination */}
            <div className="pagination-area">
              <span className="pagination-info">
                Page {currentPage} of {totalPages} | Showing {paginatedData.length} of {filteredData.length}
              </span>
              <div className="pagination-controls">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, currentPage - 2) + i;
                  return page <= totalPages ? (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "active" : ""}
                    >
                      {page}
                    </button>
                  ) : null;
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedUser && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={`User Details: ${selectedUser.name}`}
        >
          <div className="modal-content">
            <div className="details-row">
              <div className="label">Name:</div>
              <span>{selectedUser.name}</span>
            </div>
            <div className="details-row">
              <div className="label">Email:</div>
              <span>{selectedUser.email}</span>
            </div>
            <div className="details-row">
              <div className="label">Phone:</div>
              <span>{selectedUser.phone || "N/A"}</span>
            </div>
            <div className="details-row">
              <div className="label">Role:</div>
              <span className={`status-badge ${selectedUser.role === "Student" ? "role-student" : "role-manager"}`}>
                {selectedUser.role}
              </span>
            </div>
            <div className="details-row">
              <div className="label">Status:</div>
              <span className={`status-badge status-${selectedUser.status}`}>
                {selectedUser.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="details-row">
              <div className="label">Joined:</div>
              <span>{new Date(selectedUser.joinedDate).toLocaleString()}</span>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                handleEdit(selectedUser);
                setShowDetailsModal(false);
              }}>
                Edit User
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && deleteTarget && (
        <ConfirmDialog
          isOpen={showConfirmDelete}
          title="Delete User"
          message={`Are you sure you want to delete ${deleteTarget.name}? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
          isDangerous={true}
        />
      )}
    </div>
  );
};

export default Users;
   