import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "../../styles/theme.css";

const Improvements = () => {
  const [improvements, setImprovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImprovement, setSelectedImprovement] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  // Fetch improvements
  useEffect(() => {
    fetchImprovements();
  }, [page, filterStatus, filterPriority]);

  const fetchImprovements = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: PAGE_SIZE,
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterPriority !== "all" && { priority: filterPriority })
      };
      const res = await API.get("/improvements", { params });
      setImprovements(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch improvements");
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusChange = async (improvementId, newStatus) => {
    try {
      await API.put(`/improvements/${improvementId}`, { status: newStatus });
      setImprovements(prev => prev.map(i => i._id === improvementId ? { ...i, status: newStatus } : i));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // Handle priority update
  const handlePriorityChange = async (improvementId, newPriority) => {
    try {
      await API.put(`/improvements/${improvementId}`, { priority: newPriority });
      setImprovements(prev => prev.map(i => i._id === improvementId ? { ...i, priority: newPriority } : i));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update priority");
    }
  };

  // Handle assign to self
  const handleAssignToMe = async (improvementId) => {
    try {
      await API.put(`/improvements/${improvementId}`, { assignedTo: "me" });
      setImprovements(prev => prev.map(i => i._id === improvementId ? { ...i, assignedTo: "assigned" } : i));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign");
    }
  };

  // Handle submit response
  const handleSubmitResponse = async (improvementId) => {
    if (!responseText.trim()) {
      alert("Please enter a response");
      return;
    }
    try {
      await API.post(`/improvements/${improvementId}/respond`, { response: responseText });
      setResponseText("");
      setSelectedImprovement(null);
      fetchImprovements();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send response");
    }
  };

  // Handle delete
  const handleDelete = async (improvementId) => {
    if (!window.confirm("Delete this improvement?")) return;
    try {
      await API.delete(`/improvements/${improvementId}`);
      setImprovements(prev => prev.filter(i => i._id !== improvementId));
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: "#3498db",
      reviewing: "#f39c12",
      approved: "#27ae60",
      "in-backlog": "#9b59b6",
      "in-progress": "#e67e22",
      completed: "#2ecc71",
      rejected: "#e74c3c"
    };
    return colors[status] || "#3498db";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      trivial: "#95a5a6",
      small: "#3498db",
      medium: "#f39c12",
      large: "#e74c3c"
    };
    return colors[priority] || "#95a5a6";
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading improvements...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Improvements Management</h1>

      {error && <div style={{ color: "#e74c3c", marginBottom: "1rem" }}>{error}</div>}

      {/* Filters */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}>
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="reviewing">Reviewing</option>
            <option value="approved">Approved</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label>Priority:</label>
          <select value={filterPriority} onChange={(e) => { setFilterPriority(e.target.value); setPage(1); }} style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}>
            <option value="all">All Priorities</option>
            <option value="trivial">Trivial</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      {/* Improvements List */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {improvements.length === 0 ? (
          <p style={{ color: "#7f8c8d", textAlign: "center" }}>No improvements found</p>
        ) : (
          improvements.map(improvement => (
            <div key={improvement._id} style={{
              border: "1px solid #ecf0f1",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
              transition: "all 0.3s"
            }} onClick={() => setSelectedImprovement(selectedImprovement?._id === improvement._id ? null : improvement)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{improvement.title}</h3>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#7f8c8d", fontSize: "0.9rem" }}>{improvement.description}</p>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "#95a5a6" }}>
                    Suggested by: <strong>{improvement.userId?.name || "Anonymous"}</strong>
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    <span style={{ padding: "0.2rem 0.5rem", backgroundColor: getStatusColor(improvement.status), color: "white", borderRadius: "3px" }}>
                      {improvement.status}
                    </span>
                    <span style={{ padding: "0.2rem 0.5rem", backgroundColor: getPriorityColor(improvement.priority), color: "white", borderRadius: "3px" }}>
                      {improvement.priority}
                    </span>
                    <span style={{ padding: "0.2rem 0.5rem", backgroundColor: "#34495e", color: "white", borderRadius: "3px" }}>
                      👍 {improvement.votes?.upvotes || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded View */}
              {selectedImprovement?._id === improvement._id && (
                <div style={{ marginTop: "1rem", borderTop: "1px solid #ddd", paddingTop: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label>Status:</label>
                      <select value={improvement.status} onChange={(e) => handleStatusChange(improvement._id, e.target.value)} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}>
                        <option value="submitted">Submitted</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="approved">Approved</option>
                        <option value="in-backlog">In Backlog</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label>Priority:</label>
                      <select value={improvement.priority} onChange={(e) => handlePriorityChange(improvement._id, e.target.value)} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}>
                        <option value="trivial">Trivial</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <button onClick={() => handleAssignToMe(improvement._id)} style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "0.5rem"
                    }}>
                      {improvement.assignedTo ? "Already Assigned" : "Assign to Me"}
                    </button>
                  </div>

                  {/* Response */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label>Your Response:</label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response to the user..."
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
                    <button onClick={() => handleSubmitResponse(improvement._id)} style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#27ae60",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}>
                      Send Response
                    </button>
                    <button onClick={() => handleDelete(improvement._id)} style={{
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
        <button onClick={() => setPage(p => p + 1)} disabled={improvements.length < PAGE_SIZE}>Next</button>
      </div>
    </div>
  );
};

export default Improvements;
