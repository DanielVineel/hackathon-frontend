import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import Modal from "../../components/common/Modal";
import "../../styles/manager/PayUCredits.css";

/**
 * Manager PayU Credits Management Page
 * Managers can:
 * - View their PayU credits balance
 * - Add credits (top-up)
 * - View payment history
 * - Pay for students using credits
 */
const ManagerPayUCredits = () => {
  const navigate = useNavigate();

  // States
  const [creditsAccount, setCreditsAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUploading, setTopUpLoading] = useState(false);

  // Filter states
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  useEffect(() => {
    fetchCreditsAccount();
    fetchTransactions();
  }, []);

  /**
   * Fetch PayU credits account
   */
  const fetchCreditsAccount = async () => {
    try {
      const res = await API.get("/payu/credits/account");
      setCreditsAccount(res.data.credits);
    } catch (err) {
      console.error("Error fetching credits:", err);
      setError(err.response?.data?.message || "Failed to load credits account");
    }
  };

  /**
   * Fetch payment transactions
   */
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== "all") params.status = filterStatus;
      if (filterFrom) params.fromDate = filterFrom;
      if (filterTo) params.toDate = filterTo;

      const res = await API.get("/payu/transactions", { params });
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle top-up initiation
   */
  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setTopUpLoading(true);
      const res = await API.post("/payu/credits/topup", {
        amount: parseFloat(topUpAmount)
      });

      // In a real scenario, redirect to PayU gateway
      alert(`Top-up initiated. Transaction ID: ${res.data.txnid}`);
      setShowTopUpModal(false);
      setTopUpAmount("");

      // Refresh after a delay
      setTimeout(() => {
        fetchCreditsAccount();
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Top-up failed");
    } finally {
      setTopUpLoading(false);
    }
  };

  if (loading && !creditsAccount) {
    return (
      <div className="credits-page loading">
        <div className="loader"></div>
        <p>Loading credits account...</p>
      </div>
    );
  }

  return (
    <div className="manager-payu-credits">
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1>💳 PayU Credits Management</h1>
        <p>Manage your PayU credits to pay for student event registrations</p>
      </div>

      {/* Credits Summary */}
      {creditsAccount && (
        <div className="credits-summary">
          {/* Main Balance Card */}
          <div className="summary-card main">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <p className="card-label">Current Balance</p>
              <h2 className="card-value">₹{creditsAccount.accountBalance?.toFixed(2)}</h2>
            </div>
            <div className="card-health" data-status={creditsAccount.accountHealth}>
              {creditsAccount.accountHealth === "healthy" && "✓ Healthy"}
              {creditsAccount.accountHealth === "low" && "⚠️ Low Balance"}
              {creditsAccount.accountHealth === "insufficient" && "❌ Insufficient"}
              {creditsAccount.accountHealth === "blocked" && "🔒 Blocked"}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Added</p>
              <p className="stat-value">₹{creditsAccount.totalCreditsAdded?.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total Used</p>
              <p className="stat-value">₹{creditsAccount.totalCreditsUsed?.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Account Status</p>
              <p className={`stat-value status-${creditsAccount.accountStatus}`}>
                {creditsAccount.accountStatus?.toUpperCase()}
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Transaction Limit</p>
              <p className="stat-value">₹{creditsAccount.transactionLimit?.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setShowTopUpModal(true)}
              disabled={creditsAccount.accountStatus !== "active"}
            >
              + Add Credits
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate("/manager/events")}
            >
              Pay for Student Event
            </button>
          </div>
        </div>
      )}

      {/* Transactions Section */}
      <div className="transactions-section">
        <h2>Transaction History</h2>

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="filter-group">
            <label>From Date</label>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>To Date</label>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
            />
          </div>

          <button className="btn btn-secondary" onClick={fetchTransactions}>
            Filter
          </button>
        </div>

        {/* Transactions Table */}
        {transactions.length > 0 ? (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id}>
                    <td className="txn-id">{txn.internalTxnId}</td>
                    <td className="amount">₹{txn.amount?.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${txn.status}`}>
                        {txn.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>{txn.paymentMethod}</td>
                    <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-small" onClick={() => alert(`Details for ${txn._id}`)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No transactions yet</p>
          </div>
        )}
      </div>

      {/* Top-Up Modal */}
      {showTopUpModal && (
        <Modal
          isOpen={showTopUpModal}
          onClose={() => setShowTopUpModal(false)}
          title="Add Credits"
        >
          <div className="modal-content topup-form">
            <p className="info-text">
              Enter the amount you want to add to your PayU credits account.
            </p>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                min="100"
                step="100"
                placeholder="Enter amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                disabled={topUploading}
              />
              <small>Minimum: ₹100</small>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowTopUpModal(false)}
                disabled={topUploading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleTopUp}
                disabled={topUploading || !topUpAmount}
              >
                {topUploading ? "Processing..." : `Add ₹${topUpAmount || "0"}`}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManagerPayUCredits;
