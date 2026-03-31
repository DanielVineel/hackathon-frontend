import React, { useState, useEffect } from "react";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/manager/Certificates.css";

const ManagerCertificates = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Filters with bluto namespace
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("manager-certificates-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("manager-certificates-sort", "issuedAt")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("manager-certificates-sort-order", "desc")
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchCertificates();
      setCurrentPage(1);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/manager/events");
      const events = res.data?.data || [];
      setEvents(events);
      if (events.length > 0) {
        setSelectedEvent(events[0]._id);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await API.get(
        `/manager/events/${selectedEvent}/certificates`
      );
      setCertificates(res.data?.data || []);
    } catch (err) {
      console.error("Error:", err);
      setCertificates([]);
    }
  };

  const filteredCertificates = applyFilters(certificates, {
    searchTerm,
    searchFields: ["certificateId", "studentId.firstName", "studentId.lastName"],
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
    setBlutoStorage("manager-certificates-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("manager-certificates-sort", field);
    setBlutoStorage("manager-certificates-sort-order", order);
    setCurrentPage(1);
  };

  const handleDownload = (certId) => {
    window.open(`/api/certificates/${certId}/download`, "_blank");
  };

  const handleResend = async (certId) => {
    try {
      await API.post(`/manager/certificates/${certId}/resend`);
      alert("Certificate resent!");
    } catch (err) {
      alert("Error resending certificate");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manager-certificates">
      <header className="page-header">
        <h1>Issued Certificates</h1>
        <p>Manage certificates issued to students</p>
      </header>

      <div className="event-selector">
        <label htmlFor="event-select">Select Event:</label>
        <select
          id="event-select"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="event-dropdown"
        >
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
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
                <option value="score">Sort by Score</option>
                <option value="studentId.firstName">Sort by Student</option>
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
              <div className="certificates-table-wrapper">
                <table className="certificates-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student</th>
                      <th>Score</th>
                      <th>Issue Date</th>
                      <th>Certificate ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.data.map((cert, index) => (
                      <tr key={cert._id}>
                        <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td>
                          {cert.studentId?.firstName} {cert.studentId?.lastName}
                        </td>
                        <td>{cert.score}</td>
                        <td>
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </td>
                        <td className="cert-id">{cert.certificateId}</td>
                        <td className="actions">
                          <button
                            className="btn-download"
                            onClick={() => handleDownload(cert._id)}
                            title="Download certificate"
                          >
                            📥 Download
                          </button>
                          <button
                            className="btn-resend"
                            onClick={() => handleResend(cert._id)}
                            title="Resend to student"
                          >
                            ✉️ Resend
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
          ) : (
            <div className="empty">No certificates issued yet</div>
          )}
        </>
      )}
    </div>
  );
};

export default ManagerCertificates;
