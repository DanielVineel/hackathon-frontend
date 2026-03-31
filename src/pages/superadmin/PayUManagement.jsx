import React, { useState, useEffect } from "react";
import API from "../../api/api";
import Modal from "../../components/common/Modal";
import "../../styles/superadmin/PayUManagement.css";

/**
 * SuperAdmin PayU Management Page
 * Superadmins can:
 * - View all PayU credits accounts (managers, superadmins)
 * - Manage account status
 * - Process refunds
 * - View and audit all transactions
 * - Set transaction limits
 */
const SuperAdminPayUManagement = () => {
  // States
  const [accountsList, setAccountsList] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Filter states
  const [accountFilter, setAccountFilter] = useState("all");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Refund form
  const [refundData, setRefundData] = useState({
    amount: "",
    reason: ""
  });

  useEffect(() => {
    fetchPayUAccounts();
    fetchAllTransactions();
  }, []);

  /**
   * Fetch all PayU accounts
   */
  const fetchPayUAccounts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/payu/accounts");
      setAccountsList(res.data.accounts || []);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError(err.response?.data?.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all transactions
   */
  const fetchAllTransactions = async () => {
    try {
      const res = await API.get("/admin/payu/transactions");
      setTransactionsList(res.data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  /**
   * Handle refund submission
   */
  const handleRefund = async () => {
    if (!refundData.amount || parseFloat(refundData.amount) <= 0) {
      alert("Please enter a valid refund amount");
      return;
    }

    if (!refundData.reason.trim()) {
      alert("Please provide a refund reason");
      return;
    }

    try {
      const res = await API.post("/payu/refund", {
        txnid: selectedTransaction.internalTxnId,
        refundAmount: parseFloat(refundData.amount),
        refundReason: refundData.reason
      });

      alert(`Refund processed: ${res.data.refundId}`);
      setShowRefundModal(false);
      setRefundData({ amount: "", reason: "" });
      fetchAllTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "Refund failed");
    }
  };

  /**
   * Handle account status change
   */
  const handleAccountStatusChange = async (accountId, newStatus) => {
    try {
      const res = await API.put(`/admin/payu/account/${accountId}/status`, {
        status: newStatus
      });
      alert("Account status updated successfully");
      fetchPayUAccounts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  /**
   * Handle transaction limit update
   */
  const handleTransactionLimitUpdate = async (accountId, newLimit) => {
    const limit = prompt("Enter new transaction limit (₹)", newLimit);
    if (!limit || parseFloat(limit) <= 0) return;

    try {
      const res = await API.put(`/admin/payu/account/${accountId}/limit`, {
        transactionLimit: parseFloat(limit)
      });
      alert("Transaction limit updated successfully");
      fetchPayUAccounts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update limit");
    }
  };

  // Filter data
  const filteredAccounts = accountsList.filter((acc) => {
    if (accountFilter !== "all" && acc.accountStatus !== accountFilter) return false;
    if (searchQuery && !acc.userId.name?.includes(searchQuery)) return false;
    return true;
  });

  const filteredTransactions = transactionsList.filter((txn) => {
    if (transactionFilter !== "all" && txn.status !== transactionFilter) return false;
    return true;
  });

  if (loading && accountsList.length === 0) {
    return (
      <div className="payu-management loading">
        <div className="loader"></div>
        <p>Loading PayU management data...</p>
      </div>
    );
  }

  return (
    <div className="superadmin-payu-management">
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1>🔐 PayU Credits Management - SuperAdmin</h1>
        <p>Monitor and manage all PayU accounts, transactions, and credits across the platform</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className="tab-btn active">📊 Accounts</button>
        <button className="tab-btn">📋 All Transactions</button>
      </div>

      {/* Accounts Tab */}
      <div className="tab-content active">
        <div className="section">
          <div className="section-header">
            <h2>PayU Credits Accounts</h2>
            <div className="header-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)}>
                <option value="all">All Accounts</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {filteredAccounts.length > 0 ? (
            <div className="accounts-grid">
              {filteredAccounts.map((acc) => (
                <div key={acc._id} className="account-card">
                  <div className="card-header">
                    <h3>{acc.userId?.name || "Unknown"}</h3>
                    <span className={`status-badge status-${acc.accountStatus}`}>
                      {acc.accountStatus?.toUpperCase()}
                    </span>
                  </div>

                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Role:</span>
                      <span className="value">{acc.role?.toUpperCase()}</span>
                    </div>

                    <div className="info-row highlight">
                      <span className="label">Balance:</span>
                      <span className="value amount">₹{acc.accountBalance?.toFixed(2)}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">Total Added:</span>
                      <span className="value">₹{acc.totalCreditsAdded?.toFixed(2)}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">Total Used:</span>
                      <span className="value">₹{acc.totalCreditsUsed?.toFixed(2)}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">Transaction Limit:</span>
                      <span className="value">₹{acc.transactionLimit?.toFixed(2)}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">Account Health:</span>
                      <span className={`health-badge health-${acc.accountHealth}`}>
                        {acc.accountHealth?.toUpperCase()}
                      </span>
                    </div>

                    {acc.lastCreditsAddedDate && (
                      <div className="info-row">
                        <span className="label">Last Top-up:</span>
                        <span className="value">
                          {new Date(acc.lastCreditsAddedDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn btn-small"
                      onClick={() => {
                        setSelectedAccount(acc);
                        setShowAccountModal(true);
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-small"
                      onClick={() => handleTransactionLimitUpdate(acc._id, acc.transactionLimit)}
                    >
                      Set Limit
                    </button>
                    <select
                      className="status-select"
                      value={acc.accountStatus}
                      onChange={(e) => handleAccountStatusChange(acc._id, e.target.value)}
                    >
                      <option value="active">Activate</option>
                      <option value="inactive">Deactivate</option>
                      <option value="suspended">Suspend</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No accounts found</p>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Tab */}
      <div className="section">
        <div className="section-header">
          <h2>All Transactions</h2>
          <select value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)}>
            <option value="all">All Transactions</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => (
                  <tr key={txn._id}>
                    <td className="txn-id">{txn.internalTxnId}</td>
                    <td>{txn.studentId?.name?.substring(0, 20)}</td>
                    <td className="amount">₹{txn.amount?.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${txn.status}`}>
                        {txn.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>{txn.paymentMethod}</td>
                    <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-action"
                        onClick={() => {
                          setSelectedTransaction(txn);
                          if (txn.status === "success") {
                            setShowRefundModal(true);
                          }
                        }}
                        disabled={txn.status !== "success"}
                      >
                        {txn.status === "success" ? "Refund" : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No transactions found</p>
          </div>
        )}
      </div>

      {/* Account Details Modal */}
      {showAccountModal && selectedAccount && (
        <Modal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          title="Account Details"
        >
          <div className="modal-content account-details">
            <div className="detail-section">
              <h3>Account Information</h3>
              <div className="detail-row">
                <span className="label">User Name:</span>
                <span className="value">{selectedAccount.userId?.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{selectedAccount.userId?.email}</span>
              </div>
              <div className="detail-row">
                <span className="label">Role:</span>
                <span className="value">{selectedAccount.role?.toUpperCase()}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Financial Details</h3>
              <div className="detail-row">
                <span className="label">Current Balance:</span>
                <span className="value">₹{selectedAccount.accountBalance?.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Total Credits Added:</span>
                <span className="value">₹{selectedAccount.totalCreditsAdded?.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Total Credits Used:</span>
                <span className="value">₹{selectedAccount.totalCreditsUsed?.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Transaction Limit:</span>
                <span className="value">₹{selectedAccount.transactionLimit?.toFixed(2)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Account Status</h3>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`status-badge status-${selectedAccount.accountStatus}`}>
                  {selectedAccount.accountStatus?.toUpperCase()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Health:</span>
                <span className={`health-badge health-${selectedAccount.accountHealth}`}>
                  {selectedAccount.accountHealth?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedTransaction && (
        <Modal
          isOpen={showRefundModal}
          onClose={() => setShowRefundModal(false)}
          title="Process Refund"
        >
          <div className="modal-content refund-form">
            <div className="info-box">
              <p><strong>Original Transaction:</strong> {selectedTransaction.internalTxnId}</p>
              <p><strong>Amount:</strong> ₹{selectedTransaction.amount?.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</p>
            </div>

            <div className="form-group">
              <label>Refund Amount (₹)</label>
              <input
                type="number"
                value={refundData.amount}
                onChange={(e) =>
                  setRefundData({ ...refundData, amount: e.target.value })
                }
                max={selectedTransaction.amount}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Refund Reason</label>
              <textarea
                value={refundData.reason}
                onChange={(e) =>
                  setRefundData({ ...refundData, reason: e.target.value })
                }
                placeholder="Enter refund reason..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowRefundModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleRefund}
              >
                Process Refund
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SuperAdminPayUManagement;
