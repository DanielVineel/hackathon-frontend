import React, { useState, useEffect } from "react";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/student/Certificates.css";

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filters with bluto namespace
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("student-certificates-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("student-certificates-sort", "issuedAt")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("student-certificates-sort-order", "desc")
  );

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/certificates");
      setCertificates(res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load certificates");
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = applyFilters(certificates, {
    searchTerm,
    searchFields: ["eventId", "certificateId"],
    sortBy,
    sortOrder,
  });

  const paginatedData = paginateArray(
    filteredCertificates,
    currentPage,
    ITEMS_PER_PAGE
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("student-certificates-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("student-certificates-sort", field);
    setBlutoStorage("student-certificates-sort-order", order);
    setCurrentPage(1);
  };

  const handleDownload = (certId) => {
    window.open(`/api/certificates/${certId}/download`, "_blank");
  };

  const handleShare = (certId) => {
    const url = `${window.location.origin}/certificates/${certId}`;
    navigator.clipboard.writeText(url);
    alert("Certificate link copied to clipboard!");
  };

  if (loading) return <div className="loading">Loading certificates...</div>;

  return (
    <div className="student-certificates">
      <header className="page-header">
        <h1>My Certificates</h1>
        <p>View and download your earned certificates</p>
      </header>

      {error && <div className="error-message">{error}</div>}

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
            <option value="issuedAt">Sort by Date</option>
            <option value="eventId">Sort by Event</option>
            <option value="score">Sort by Score</option>
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

      {paginatedData.data.length > 0 ? (
        <>
          <div className="certificates-grid">
            {paginatedData.data.map((cert) => (
              <div key={cert._id} className="certificate-card">
                <div className="cert-header">
                  <h3>{cert.eventId?.name}</h3>
                  <span className="new-badge">✓</span>
                </div>
                <div className="cert-content">
                  <p>
                    <strong>Score:</strong> {cert.score}
                  </p>
                  <p>
                    <strong>Issued:</strong>{" "}
                    {new Date(cert.issuedAt).toLocaleDateString()}
                  </p>
                  <p className="cert-id">
                    <strong>ID:</strong> {cert.certificateId}
                  </p>
                </div>
                <div className="cert-actions">
                  <button
                    className="btn-download"
                    onClick={() => handleDownload(cert._id)}
                  >
                    📥 Download
                  </button>
                  <button
                    className="btn-share"
                    onClick={() => handleShare(cert._id)}
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData.pages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredCertificates.length}
          />
        </>
      ) : (
        <div className="empty">
          <p>
            No certificates yet. Solve problems and participate in events to
            earn certificates!
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;
