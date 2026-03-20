import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/ManagerSubmissions.css";

const ManagerSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filters with bluto namespace
  const [selectedEvent, setSelectedEvent] = useState(
    getBlutoStorage("manager-submissions-event", "all")
  );
  const [filterStatus, setFilterStatus] = useState(
    getBlutoStorage("manager-submissions-status", "all")
  );
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("manager-submissions-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("manager-submissions-sort", "createdAt")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("manager-submissions-sort-order", "desc")
  );

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedEvent, filterStatus]);

  const fetchData = async () => {
    try {
      const [submissionsRes, eventsRes] = await Promise.all([
        API.get("/manager/submissions").catch(() => ({ data: { data: [] } })),
        API.get("/manager/events").catch(() => ({ data: { data: [] } })),
      ]);
      setSubmissions(submissionsRes.data?.data || []);
      setEvents(eventsRes.data?.data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/manager/submissions/${id}/status`, {
        status: newStatus,
        feedback,
      });
      alert("Submission updated!");
      setShowDetail(false);
      setFeedback("");
      fetchData();
    } catch (err) {
      alert("Error updating submission");
    }
  };

  const filteredSubmissions = applyFilters(submissions, {
    searchTerm,
    searchFields: ["studentId.firstName", "studentId.lastName", "problemId.name"],
    sortBy,
    sortOrder,
  })
    .filter((sub) => {
      const matchesEvent = selectedEvent === "all" || sub.eventId === selectedEvent;
      const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
      return matchesEvent && matchesStatus;
    });

  const paginatedData = paginateArray(
    filteredSubmissions,
    currentPage,
    ITEMS_PER_PAGE
  );

  const handleEventChange = (e) => {
    const value = e.target.value;
    setSelectedEvent(value);
    setBlutoStorage("manager-submissions-event", value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setFilterStatus(value);
    setBlutoStorage("manager-submissions-status", value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("manager-submissions-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("manager-submissions-sort", field);
    setBlutoStorage("manager-submissions-sort-order", order);
    setCurrentPage(1);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manager-submissions">
      <h1>Review Submissions</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select value={selectedEvent} onChange={handleEventChange} className="event-select">
          <option value="all">All Events</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>
        <select value={filterStatus} onChange={handleStatusChange} className="status-select">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {paginatedData.data.length > 0 ? (
        <>
          <table className="submissions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Problem</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.data.map((sub, index) => (
                <tr key={sub._id}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td>{sub.studentId?.firstName} {sub.studentId?.lastName}</td>
                  <td>{sub.problemId?.name}</td>
                  <td>
                    <span className={`badge badge-${sub.status}`}>{sub.status}</span>
                  </td>
                  <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setShowDetail(true);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData.pages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredSubmissions.length}
          />
        </>
      ) : (
        <div className="empty">No submissions found</div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedSubmission && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submission Details</h2>
              <button className="close-btn" onClick={() => setShowDetail(false)}>
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="submission-info">
                <p>
                  <strong>Student:</strong> {selectedSubmission.studentId?.firstName}{" "}
                  {selectedSubmission.studentId?.lastName}
                </p>
                <p>
                  <strong>Problem:</strong> {selectedSubmission.problemId?.name}
                </p>
                <p>
                  <strong>Score:</strong> {selectedSubmission.score || 0}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`badge badge-${selectedSubmission.status}`}>
                    {selectedSubmission.status}
                  </span>
                </p>
              </div>

              <div className="code-section">
                <h3>Submitted Code:</h3>
                <pre>{selectedSubmission.code}</pre>
              </div>

              <div className="form-group">
                <label>Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Add your feedback here..."
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn-accept"
                  onClick={() => handleStatusUpdate(selectedSubmission._id, "accepted")}
                >
                  ✓ Accept
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleStatusUpdate(selectedSubmission._id, "rejected")}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerSubmissions;
