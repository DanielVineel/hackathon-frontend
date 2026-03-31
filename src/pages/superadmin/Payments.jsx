// src/pages/superadmin/Payments.jsx
import React, { useEffect, useState, useMemo } from "react";
import Pagination from "../../components/common/Pagination";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../../styles/theme.css";
import "../styles/superadmin/Payments.css";

const ITEMS_PER_PAGE = 12;

const STATUS_COLORS = {
  completed: "badge-easy",
  pending:   "badge-medium",
  failed:    "badge-hard",
  refunded:  "badge-info",
};

const Payments = () => {
  const [payments,  setPayments]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [page,      setPage]      = useState(1);
  const [search,    setSearch]    = useState("");
  const [status,    setStatus]    = useState("all");
  const [sortBy,    setSortBy]    = useState("createdAt");
  const [sortDir,   setSortDir]   = useState("desc");

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/superadmin/payments");
      setPayments(res.data?.payments || []);
    } catch {
      setError("Failed to load payment records");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = useMemo(
    () => payments.filter(p => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0),
    [payments]
  );

  const filtered = useMemo(() => {
    let d = [...payments];
    if (search) {
      const s = search.toLowerCase();
      d = d.filter(p =>
        p.transactionId?.toLowerCase().includes(s) ||
        p.user?.toLowerCase().includes(s) ||
        p.event?.toLowerCase().includes(s)
      );
    }
    if (status !== "all") d = d.filter(p => p.status === status);
    d.sort((a, b) => {
      const va = a[sortBy], vb = b[sortBy];
      if (sortDir === "asc") return va > vb ? 1 : -1;
      return va < vb ? 1 : -1;
    });
    return d;
  }, [payments, search, status, sortBy, sortDir]);

  const paginated = useMemo(() => paginateArray(filtered, page, ITEMS_PER_PAGE), [filtered, page]);

  const fmt = (amt) => `₹${(amt || 0).toLocaleString("en-IN")}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment <span>Records</span></h1>
          <p style={{ color:"var(--text-muted)", fontSize:13, marginTop:4 }}>
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchPayments}>↻ Refresh</button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", marginBottom:28 }}>
        <div className="stat-card">
          <div className="stat-icon cyan">💳</div>
          <div>
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value" style={{ fontSize:20 }}>{fmt(totalRevenue)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div>
            <p className="stat-label">Completed</p>
            <p className="stat-value" style={{ fontSize:20 }}>{payments.filter(p=>p.status==="completed").length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⏳</div>
          <div>
            <p className="stat-label">Pending</p>
            <p className="stat-value" style={{ fontSize:20 }}>{payments.filter(p=>p.status==="pending").length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:"rgba(255,23,68,0.12)" }}>✗</div>
          <div>
            <p className="stat-label">Failed</p>
            <p className="stat-value" style={{ fontSize:20 }}>{payments.filter(p=>p.status==="failed").length}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <div className="search-bar" style={{ flex:1 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="form-control" placeholder="Search by user, event, transaction ID…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="form-control" style={{ width:140 }} value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select className="form-control" style={{ width:150 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="createdAt">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
        </select>
        <button className="btn btn-ghost btn-sm" onClick={() => setSortDir(d => d==="asc" ? "desc" : "asc")}>
          {sortDir === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state"><div className="spinner" /><span>Loading payments…</span></div>
      ) : paginated.data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💳</div>
          <p className="empty-state-text">No payment records found</p>
        </div>
      ) : (
        <div className="card" style={{ padding:0, overflow:"hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Transaction ID</th>
                <th>User</th>
                <th>Event</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.data.map((p, i) => (
                <tr key={p._id}>
                  <td style={{ color:"var(--text-muted)" }}>{(page-1)*ITEMS_PER_PAGE + i + 1}</td>
                  <td style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"var(--accent)" }}>
                    {p.transactionId || "—"}
                  </td>
                  <td style={{ color:"var(--text-primary)" }}>{p.user || "Unknown"}</td>
                  <td>{p.event || "—"}</td>
                  <td style={{ fontWeight:600, color:"var(--text-primary)" }}>{fmt(p.amount)}</td>
                  <td>
                    <span className={`badge ${STATUS_COLORS[p.status] || "badge-info"}`}>
                      {p.status || "unknown"}
                    </span>
                  </td>
                  <td style={{ fontSize:12, color:"var(--text-muted)" }}>{fmtDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination currentPage={page} totalPages={paginated.pages} onPageChange={setPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
    </div>
  );
};

export default Payments;