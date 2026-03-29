import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "../../styles/theme.css";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchEmail, setSearchEmail] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, [page, filterStatus, filterCategory, searchEmail]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: PAGE_SIZE,
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterCategory !== "all" && { category: filterCategory }),
        ...(searchEmail && { email: searchEmail })
      };
      const res = await API.get("/contact", { params });
      setContacts(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await API.put(`/contact/${contactId}`, { status: newStatus });
      setContacts(prev => prev.map(c => c._id === contactId ? { ...c, status: newStatus } : c));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // Handle submit response
  const handleSubmitResponse = async (contactId) => {
    if (!responseText.trim()) {
      alert("Please enter a response");
      return;
    }
    try {
      await API.post(`/contact/${contactId}/respond`, { response: responseText });
      setResponseText("");
      setSelectedContact(null);
      fetchContacts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send response");
    }
  };

  // Handle delete
  const handleDelete = async (contactId) => {
    if (!window.confirm("Delete this contact message?")) return;
    try {
      await API.delete(`/contact/${contactId}`);
      setContacts(prev => prev.filter(c => c._id !== contactId));
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "#3498db",
      read: "#95a5a6",
      responded: "#27ae60",
      spam: "#e74c3c"
    };
    return colors[status] || "#3498db";
  };

  const getCategoryColor = (category) => {
    const colors = {
      feedback: "#2ecc71",
      bug: "#e74c3c",
      feature: "#9b59b6",
      support: "#f39c12",
      other: "#95a5a6"
    };
    return colors[category] || "#95a5a6";
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading contacts...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Contact Messages Management</h1>

      {error && <div style={{ color: "#e74c3c", marginBottom: "1rem" }}>{error}</div>}

      {/* Filters and Search */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
            <option value="spam">Spam</option>
          </select>
        </div>
        <div>
          <label>Category:</label>
          <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }} style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}>
            <option value="all">All Categories</option>
            <option value="feedback">Feedback</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="support">Support</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Search Email:</label>
          <input
            type="email"
            placeholder="Filter by email..."
            value={searchEmail}
            onChange={(e) => { setSearchEmail(e.target.value); setPage(1); }}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
          />
        </div>
      </div>

      {/* Contacts List */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {contacts.length === 0 ? (
          <p style={{ color: "#7f8c8d", textAlign: "center" }}>No contacts found</p>
        ) : (
          contacts.map(contact => (
            <div key={contact._id} style={{
              border: "1px solid #ecf0f1",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: contact.status === "new" ? "#f0f8ff" : "#f8f9fa",
              cursor: "pointer",
              transition: "all 0.3s"
            }} onClick={() => setSelectedContact(selectedContact?._id === contact._id ? null : contact)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{contact.name}</h3>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#7f8c8d" }}>
                    <strong>Email:</strong> {contact.email}
                  </p>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#7f8c8d" }}>
                    <strong>Subject:</strong> {contact.subject}
                  </p>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", color: "#555", fontStyle: "italic" }}>
                    {contact.message.substring(0, 120)}...
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    <span style={{ padding: "0.2rem 0.5rem", backgroundColor: getStatusColor(contact.status), color: "white", borderRadius: "3px" }}>
                      {contact.status}
                    </span>
                    <span style={{ padding: "0.2rem 0.5rem", backgroundColor: getCategoryColor(contact.category), color: "white", borderRadius: "3px" }}>
                      {contact.category}
                    </span>
                    {contact.userId && (
                      <span style={{ padding: "0.2rem 0.5rem", backgroundColor: "#34495e", color: "white", borderRadius: "3px" }}>
                        User: {contact.userId.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded View */}
              {selectedContact?._id === contact._id && (
                <div style={{ marginTop: "1rem", borderTop: "1px solid #ddd", paddingTop: "1rem" }}>
                  {/* Full Message */}
                  <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#ecf0f1", borderRadius: "4px" }}>
                    <strong>Full Message:</strong>
                    <p style={{ margin: "0.5rem 0 0 0", whiteSpace: "pre-wrap" }}>{contact.message}</p>
                  </div>

                  {/* Status Update */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label>Status:</label>
                      <select value={contact.status} onChange={(e) => handleStatusChange(contact._id, e.target.value)} style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="responded">Responded</option>
                        <option value="spam">Spam</option>
                      </select>
                    </div>
                    <div>
                      <label>Category:</label>
                      <select disabled style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", backgroundColor: "#ecf0f1" }}>
                        <option>{contact.category}</option>
                      </select>
                    </div>
                  </div>

                  {/* Response */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label>Your Response:</label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response to the contact..."
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

                  {/* Previous Response */}
                  {contact.approvedResponse && (
                    <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#f0fff0", borderRadius: "4px", borderLeft: "3px solid #27ae60" }}>
                      <strong>Previous Response:</strong>
                      <p style={{ margin: "0.5rem 0 0 0", whiteSpace: "pre-wrap" }}>{contact.approvedResponse}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => handleSubmitResponse(contact._id)} style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#27ae60",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}>
                      Send Response
                    </button>
                    <button onClick={() => handleDelete(contact._id)} style={{
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
        <button onClick={() => setPage(p => p + 1)} disabled={contacts.length < PAGE_SIZE}>Next</button>
      </div>
    </div>
  );
};

export default Contacts;
