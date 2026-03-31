import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import Modal from "../../components/common/Modal";
import "../styles/eventCreator/EventCreatorPayUAccount.css";

/**
 * Event Creator PayU Account Management
 * Allows event creators to:
 * - View their PayU credits balance
 * - Add more credits
 * - View transaction history
 * - Withdraw credits
 */
const EventCreatorPayUAccount = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    balance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    accountHealth: "healthy"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchAccountData();
    fetchTransactions();
  }, []);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/payu/credits/account");
      const data = res.data?.data;

      setAccount(data);
      setStats({
        balance: data?.accountBalance || 0,
        totalEarned: data?.totalCreditsAdded || 0,
        totalWithdrawn: data?.totalCreditsUsed || 0,
        accountHealth: data?.accountHealth || "healthy"
      });
    } catch (err) {
      console.error("Error fetching account:", err);
      setError(err.response?.data?.message || "Failed to load account");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/payu/transactions?limit=100");
      setTransactions(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (withdrawAmount > stats.balance) {
      alert("Insufficient balance");
      return;
    }

    try {
      setWithdrawing(true);
      
      // Call backend API to initiate withdrawal
      const res = await API.post("/payu/credits/withdraw", {
        amount: parseFloat(withdrawAmount),
        withdrawType: "bank_transfer"
      });

      alert("Withdrawal initiated. You will receive the amount in 2-3 business days.");
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      fetchAccountData();
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "Withdrawal failed");
    } finally {
      setWithdrawing(false);
    }
  };

  const getHealthBadgeClass = (health) => {
    switch (health) {
      case "healthy":
        return "badge-healthy";
      case "low":
        return "badge-low";
      case "insufficient":
        return "badge-insufficient";
      case "blocked":
        return "badge-blocked";
      default:
        return "";
    }
  };

  if (loading) {
    return <div className="loading">Loading account...</div>;
  }

  return (
    <div className="event-creator-payu">
      {/* Header */}
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>💳 PayU Account</h1>
        <button 
          className="btn-refresh"
          onClick={() => {
            fetchAccountData();
            fetchTransactions();
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Account Summary */}
      <div className="account-summary">
        <div className="summary-card main-balance">
          <div className="card-label">Current Balance</div>
          <div className="card-value">₹{stats.balance?.toLocaleString()}</div>
          <div className={`health-badge ${getHealthBadgeClass(stats.accountHealth)}`}>
            {stats.accountHealth}
          </div>
        </div>

        <div className="summary-card">
          <div className="card-label">Total Earned</div>
          <div className="card-value earned">+₹{stats.totalEarned?.toLocaleString()}</div>
          <div className="card-subtext">From event registrations</div>
        </div>

        <div className="summary-card">
          <div className="card-label">Total Used</div>
          <div className="card-value used">-₹{stats.totalWithdrawn?.toLocaleString()}</div>
          <div className="card-subtext">Withdrawals & transfers</div>
        </div>

        <div className="summary-card">
          <div className="card-label">Account Status</div>
          <div className="card-value">{account?.accountStatus || "Active"}</div>
          <div className="card-subtext">All transactions enabled</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="btn-primary"
          onClick={() => navigate("/event-creator/dashboard")}
        >
          📊 Back to Dashboard
        </button>
        <button 
          className="btn-secondary"
          onClick={() => setShowWithdrawModal(true)}
          disabled={stats.balance <= 0}
        >
          💰 Withdraw
        </button>
        <button 
          className="btn-outline"
          onClick={() => navigate("/student/events")}
        >
          📋 View Events
        </button>
      </div>

      {/* Account Details */}
      <div className="account-details">
        <h2>Account Information</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Account Holder:</span>
            <span className="detail-value">Event Creator</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Account Type:</span>
            <span className="detail-value">PayU Merchant</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Transaction Limit:</span>
            <span className="detail-value">₹{account?.transactionLimit?.toLocaleString() || "100,000"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className={`status-badge ${account?.accountStatus}`}>
              {account?.accountStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="transactions-section">
        <h2>Recent Transactions</h2>
        {transactions.length > 0 ? (
          <div className="transactions-list">
            {transactions.map((txn, index) => (
              <div key={txn._id || index} className="transaction-row">
                <div className="txn-left">
                  <div className="txn-id">{txn.internalTxnId}</div>
                  <div className="txn-date">
                    {new Date(txn.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <div className="txn-middle">
                  <div className="txn-type">{txn.paymentMethod}</div>
                  <div className="txn-event">{txn.eventId?.title || "Event"}</div>
                </div>
                <div className="txn-status">
                  <span className={`status-badge ${txn.status}`}>
                    {txn.status}
                  </span>
                </div>
                <div className={`txn-amount ${txn.paidBy === "admin" ? "received" : "paid"}`}>
                  {txn.paidBy === "admin" ? "+" : "-"}₹{txn.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-transactions">No transactions yet</p>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <Modal title="Withdraw Funds" onClose={() => setShowWithdrawModal(false)}>
          <div className="withdraw-form">
            <div className="form-group">
              <label>Amount to Withdraw</label>
              <div className="input-wrapper">
                <span className="currency">₹</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  max={stats.balance}
                  disabled={withdrawing}
                />
              </div>
              <div className="amount-info">
                Available: ₹{stats.balance?.toLocaleString()}
              </div>
            </div>

            <div className="form-group">
              <label>Withdrawal Method</label>
              <select className="form-select" disabled={withdrawing}>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            <div className="form-info">
              💡 Withdrawals are processed in 2-3 business days. A transaction fee of 1% will be applied.
            </div>

            <div className="form-actions">
              <button
                className="btn-primary"
                onClick={handleWithdraw}
                disabled={withdrawing || !withdrawAmount}
              >
                {withdrawing ? "Processing..." : "Confirm Withdrawal"}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowWithdrawModal(false)}
                disabled={withdrawing}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventCreatorPayUAccount;
