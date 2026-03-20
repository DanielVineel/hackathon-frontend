import React, { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/SuperAdminCertificates.css";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    event: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filters with bluto namespace
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("superadmin-certificates-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("superadmin-certificates-sort", "createdAt")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("superadmin-certificates-sort-order", "desc")
  );

  // Fetch certificates
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await API.get("/superadmin/certificates");
      setCertificates(res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching certificates", err);
      setError("Failed to load certificates");
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCertificates = applyFilters(certificates, {
    searchTerm,
    searchFields: ["name", "event", "description"],
    sortBy,
    sortOrder,
  });

  const paginatedData = paginateArray(
    filteredCertificates,
    currentPage,
    ITEMS_PER_PAGE
  );

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/superadmin/certificates/${editId}`, formData);
      } else {
        await API.post("/superadmin/certificates", formData);
      }

      setFormData({ name: "", event: "", description: "" });
      setEditId(null);
      setError(null);
      fetchCertificates();
    } catch (err) {
      console.error("Error saving certificate", err);
      setError("Failed to save certificate");
    }
  };

  // Edit
  const handleEdit = (cert) => {
    setFormData({
      name: cert.name,
      event: cert.event,
      description: cert.description,
    });
    setEditId(cert._id);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;

    try {
      await API.delete(`/superadmin/certificates/${id}`);
      fetchCertificates();
      setError(null);
    } catch (err) {
      console.error("Error deleting certificate", err);
      setError("Failed to delete certificate");
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("superadmin-certificates-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("superadmin-certificates-sort", field);
    setBlutoStorage("superadmin-certificates-sort-order", order);
    setCurrentPage(1);
  };

  return (
    <div className="superadmin-certificates">
      <header className="page-header">
        <h1>Certificates Management</h1>
        <p>Create, update, and manage certificate templates</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      {/* Form Section */}
      <div className="cert-form-section">
        <h2>{editId ? "Update Certificate" : "Create Certificate"}</h2>

        <form onSubmit={handleSubmit} className="cert-form">
          <div className="form-group">
            <label htmlFor="name">Certificate Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter certificate name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="event">Event Name *</label>
            <input
              type="text"
              id="event"
              name="event"
              placeholder="Enter event name"
              className="form-control"
              value={formData.event}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter certificate description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {editId ? "Update Certificate" : "Create Certificate"}
            </button>

            {editId && (
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setEditId(null);
                  setFormData({ name: "", event: "", description: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="cert-list-section">
        <h2>All Certificates</h2>

        <div className="certificates-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value, sortOrder)}
              className="sort-select"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="event">Sort by Event</option>
            </select>
            <button
              className={`sort-order-btn ${sortOrder}`}
              onClick={() =>
                handleSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
              }
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="loading">Loading certificates...</p>
        ) : paginatedData.data.length === 0 ? (
          <div className="no-results">
            <p>No certificates found</p>
          </div>
        ) : (
          <>
            <div className="certificates-table-wrapper">
              <table className="certificates-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Event</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.data.map((cert, index) => (
                    <tr key={cert._id}>
                      <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                      <td>{cert.name}</td>
                      <td>{cert.event}</td>
                      <td>{cert.description || "-"}</td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(cert)}
                          title="Edit certificate"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(cert._id)}
                          title="Delete certificate"
                        >
                          🗑️ Delete
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
              totalItems={filteredCertificates.length}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Certificates;