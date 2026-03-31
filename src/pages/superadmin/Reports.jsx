import  { useState, useEffect } from "react";
import API from "../../api/api";
import "../../styles/theme.css";
import "../styles/superadmin/Reports.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  // Fetch reports
  useEffect(() => {
    fetchReports();
  }, [page, filterStatus]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: PAGE_SIZE,
        ...(filterStatus !== "all" && { status: filterStatus })
      };
      const res = await API.get("/reports", { params });
      setReports(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await API.put(`/reports/${reportId}`, { status: newStatus });
      setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // Handle assign to self
  const handleAssignToMe = async (reportId) => {
    try {
      await API.put(`/reports/${reportId}`, { assignedTo: "me" });
      setReports(prev => prev.map(r => r._id === reportId ? { ...r, assignedTo: "assigned" } : r));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign");
    }
  };

  // Handle submit response
  const handleSubmitResponse = async (reportId) => {
    if (!responseText.trim()) {
      alert("Please enter a response");
      return;
    }
    try {
      await API.post(`/reports/${reportId}/respond`, { response: responseText });
      setResponseText("");
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send response");
    }
  };

  // Handle delete
  const handleDelete = async (reportId) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await API.delete(`/reports/${reportId}`);
      setReports(prev => prev.filter(r => r._id !== reportId));
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "#3498db",
      "in-progress": "#f39c12",
      resolved: "#27ae60",
      closed: "#95a5a6",
      rejected: "#e74c3c"
    };
    return colors[status] || "#3498db";
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading reports...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Bug Reports Management</h1>

      {error && <div style={{ color: "#e74c3c", marginBottom: "1rem" }}>{error}</div>}

      {/* Filter */}
      <div style={{ marginBottom: "1rem" }}>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Reports List */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {reports.length === 0 ? (
          <p style={{ color: "#7f8c8d", textAlign: "center" }}>No reports found</p>
        ) : (
          reports.map(report => (
            <div key={report._id} style={{
              border: "1px solid #ecf0f1",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
              transition: "all 0.3s"
            }} onClick={() => setSelectedReport(selectedReport?._id === report._id ? null : report)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{report.title}</h3>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#7f8c8d", fontSize: "0.9rem" }}>{report.description}</p>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "#95a5a6" }}>
                    Reported by: <strong>{report.userId?.name || "Anonymous"}</strong>
                  </p>
                </div>
                <span style={{
                  padding: "0.4rem 0.8rem",
                  backgroundColor: getStatusColor(report.status),
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  whiteSpace: "nowrap"
                }}>
                  {report.status.toUpperCase()}
                </span>
              </div>

              {/* Expanded View */}
              {selectedReport?._id === report._id && (
                <div style={{ marginTop: "1rem", borderTop: "1px solid #ddd", paddingTop: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label>Status:</label>
                      <select value={report.status} onChange={(e) => handleStatusChange(report._id, e.target.value)} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <button onClick={() => handleAssignToMe(report._id)} style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}>
                      {report.assignedTo ? "Assigned" : "Assign to Me"}
                    </button>
                  </div>

                  {/* Response */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label>Your Response:</label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response to the reporter..."
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        marginTop: "0.25rem",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        fontFamily: "inherit",
                        minHeight: "100px",
                        resize: "vertical"
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => handleSubmitResponse(report._id)} style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#27ae60",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}>
                      Send Response
                    </button>
                    <button onClick={() => handleDelete(report._id)} style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: "2rem", textAlign: "center", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={reports.length < PAGE_SIZE}>Next</button>
      </div>
    </div>
  );
};

export default Reports;
