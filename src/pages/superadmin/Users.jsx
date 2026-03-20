// src/pages/superadmin/Users.jsx
import React, { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import { useTheme } from "../../context/ThemeContext";
import "./Users.css";

const Users = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Filters with bluto namespace
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("superadmin-users-search", "")
  );
  const [filterRole, setFilterRole] = useState(
    getBlutoStorage("superadmin-users-role", "all")
  );
  const [activeTab, setActiveTab] = useState(
    getBlutoStorage("superadmin-users-tab", "students")
  );
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch both students and managers
      const [studentsRes, managersRes] = await Promise.all([
        API.get("/students"),
        API.get("/managers")
      ]);
      
      const allUsers = [
        ...(studentsRes.data?.data || []).map(s => ({ ...s, role: "student" })),
        ...(managersRes.data?.data || []).map(m => ({ ...m, role: "manager" }))
      ];
      
      setUsers(allUsers);
      applyFiltersAndSearch(allUsers, searchTerm, filterRole);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply filters and search
  const applyFiltersAndSearch = (userList, searchValue, role) => {
    let filtered = userList;

    // Search filter
    if (searchValue.trim()) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Role filter
    if (role !== "all") {
      filtered = filtered.filter(user => user.role === role);
    }

    setFilteredUsers(filtered);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setBlutoStorage("superadmin-users-search", value);
    applyFiltersAndSearch(users, value, filterRole);
    setCurrentPage(1);
  };

  // Handle filter
  const handleFilter = (role) => {
    setFilterRole(role);
    setBlutoStorage("superadmin-users-role", role);
    applyFiltersAndSearch(users, searchTerm, role);
    setCurrentPage(1);
  };

  // Handle tab switch
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setBlutoStorage("superadmin-users-tab", tab);
    if (tab === "students") {
      handleFilter("student");
    } else if (tab === "managers") {
      handleFilter("manager");
    } else {
      handleFilter("all");
    }
  };

  const paginatedData = paginateArray(
    filteredUsers,
    currentPage,
    ITEMS_PER_PAGE
  );

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const endpoint = selectedUser.role === "student" ? "/students" : "/managers";
      await API.delete(`${endpoint}/${userId}`);
      alert("User deleted successfully!");
      setShowUserDetails(false);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  // Deactivate user
  const handleDeactivateUser = async (userId) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;
    
    try {
      const endpoint = selectedUser.role === "student" ? "/students" : "/managers";
      await API.put(`${endpoint}/${userId}`, { status: "inactive" });
      alert("User deactivated successfully!");
      setShowUserDetails(false);
      fetchUsers();
    } catch (err) {
      console.error("Error deactivating user:", err);
      alert(err.response?.data?.message || "Error deactivating user");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      default:
        return "status-pending";
    }
  };

  return (
    <div className={`users-page theme-${theme}`}>
      <div className="users-header">
        <h2>User Management</h2>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{users.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Students</span>
            <span className="stat-value">{users.filter(u => u.role === "student").length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Managers</span>
            <span className="stat-value">{users.filter(u => u.role === "manager").length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="users-tabs">
        <button
          className={`tab ${activeTab === "students" ? "active" : ""}`}
          onClick={() => handleTabSwitch("students")}
        >
          Students
        </button>
        <button
          className={`tab ${activeTab === "managers" ? "active" : ""}`}
          onClick={() => handleTabSwitch("managers")}
        >
          Managers
        </button>
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabSwitch("all")}
        >
          All Users
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name, email, or username..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Users Table */}
      {paginatedData.data.length === 0 ? (
        <div className="no-users">
          <p>No users found</p>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.data.map((user, index) => (
                  <tr key={user._id} className="user-row">
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td>{user.name || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(user.status)}`}>
                        {user.status || "ACTIVE"}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <button
                        className="action-btn view-btn"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData.pages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredUsers.length}
          />
        </>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="user-details-modal" onClick={() => setShowUserDetails(false)}>
          <div className="user-details-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowUserDetails(false)}>✕</button>

            <div className="user-detail-header">
              <div className="user-avatar">
                {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="user-header-info">
                <h2>{selectedUser.name || "N/A"}</h2>
                <p className="user-email">{selectedUser.email}</p>
                <div className="user-badges">
                  <span className={`role-badge role-${selectedUser.role}`}>
                    {selectedUser.role?.toUpperCase()}
                  </span>
                  <span className={`status-badge ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status || "ACTIVE"}
                  </span>
                </div>
              </div>
            </div>

            <div className="user-detail-sections">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-row">
                  <label>Name:</label>
                  <value>{selectedUser.name || "N/A"}</value>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <value>{selectedUser.email}</value>
                </div>
                <div className="detail-row">
                  <label>Username:</label>
                  <value>{selectedUser.username || "N/A"}</value>
                </div>
                <div className="detail-row">
                  <label>Phone:</label>
                  <value>{selectedUser.phone || "N/A"}</value>
                </div>
              </div>

              <div className="detail-section">
                <h3>Account Information</h3>
                <div className="detail-row">
                  <label>Role:</label>
                  <value>{selectedUser.role?.toUpperCase()}</value>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <value>{selectedUser.status || "ACTIVE"}</value>
                </div>
                <div className="detail-row">
                  <label>Joined:</label>
                  <value>{formatDate(selectedUser.createdAt)}</value>
                </div>
                <div className="detail-row">
                  <label>Last Updated:</label>
                  <value>{formatDate(selectedUser.updatedAt)}</value>
                </div>
              </div>

              {selectedUser.role === "student" && (
                <div className="detail-section">
                  <h3>Student Information</h3>
                  <div className="detail-row">
                    <label>School/College:</label>
                    <value>{selectedUser.schoolCollege || "N/A"}</value>
                  </div>
                  <div className="detail-row">
                    <label>Grade/Year:</label>
                    <value>{selectedUser.gradeYear || "N/A"}</value>
                  </div>
                  <div className="detail-row">
                    <label>Events Participated:</label>
                    <value>{selectedUser.eventsParticipated?.length || 0}</value>
                  </div>
                </div>
              )}

              {selectedUser.role === "manager" && (
                <div className="detail-section">
                  <h3>Manager Information</h3>
                  <div className="detail-row">
                    <label>Organization:</label>
                    <value>{selectedUser.organization || "N/A"}</value>
                  </div>
                  <div className="detail-row">
                    <label>Events Managed:</label>
                    <value>{selectedUser.managedEvents?.length || 0}</value>
                  </div>
                </div>
              )}
            </div>

            <div className="detail-actions">
              <button className="btn-edit">Edit User</button>
              <button className="btn-deactivate" onClick={() => handleDeactivateUser(selectedUser._id)}>
                Deactivate
              </button>
              <button className="btn-delete" onClick={() => handleDeleteUser(selectedUser._id)}>
                Delete User
              </button>
              <button className="btn-close" onClick={() => setShowUserDetails(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;