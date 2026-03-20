import React, { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/SuperAdminPayments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ status: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filters with bluto namespace
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(
    getBlutoStorage("superadmin-payments-filters", {})
  );
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("superadmin-payments-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("superadmin-payments-sort", "createdAt")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("superadmin-payments-sort-order", "desc")
  );

  // Fetch payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/superadmin/payments");
      setPayments(res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching payments", err);
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = applyFilters(payments, {
    searchTerm,
    searchFields: ["user", "event", "transactionId"],
    filters: activeFilters,
    sortBy,
    sortOrder,
  });

  const paginatedData = paginateArray(
    filteredPayments,
    currentPage,
    ITEMS_PER_PAGE
  );

  const handleFilterChange = (filters) => {
    setBlutoStorage("superadmin-payments-filters", filters);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setBlutoStorage("superadmin-payments-filters", {});
    setBlutoStorage("superadmin-payments-search", "");
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("superadmin-payments-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("superadmin-payments-sort", field);
    setBlutoStorage("superadmin-payments-sort-order", order);
    setCurrentPage(1);
  };

  // Edit payment
  const handleEdit = (payment) => {
    setEditId(payment._id);
    setEditData({ status: payment.status || "" });
  };

  // Update payment
  const handleUpdate = async (id) => {
    try {
      await API.put(`/superadmin/payment/${id}`, editData);
      setEditId(null);
      fetchPayments();
      alert("Payment updated successfully");
    } catch (err) {
      alert("Error updating payment");
    }
  };

  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const filterConfig = [
    {
      key: "status",
      type: "multiselect",
      label: "Payment Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "success", label: "Success" },
        { value: "failed", label: "Failed" },
        { value: "refunded", label: "Refunded" },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "warning",
      success: "success",
      failed: "danger",
      refunded: "info",
    };
    const badgeClass = statusMap[status] || "secondary";
    return <span className={`badge badge-${badgeClass}`}>{status}</span>;
  };

  return (
    <div className="superadmin-payments">
      <header className="page-header">
        <h1>Payment Management</h1>
        <p>Monitor and manage all payment transactions</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="payments-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by user, event, or transaction ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <FilterPanel
          filters={filterConfig}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          isOpen={filterOpen}
          onToggle={() => setFilterOpen(!filterOpen)}
        />

        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value, sortOrder)}
            className="sort-select"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
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

      {loading ? (
        <div className="loading">Loading payments...</div>
      ) : paginatedData.data.length > 0 ? (
        <>
          <div className="payments-table-wrapper">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Event</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.data.map((payment, index) => (
                  <tr key={payment._id}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td className="user-cell">{payment.user?.name || "N/A"}</td>
                    <td className="event-cell">{payment.event?.name || "N/A"}</td>
                    <td className="amount-cell">₹{payment.amount?.toLocaleString()}</td>
                    <td>
                      {editId === payment._id ? (
                        <select
                          name="status"
                          className="status-select"
                          value={editData.status}
                          onChange={handleChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="success">Success</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      ) : (
                        getStatusBadge(payment.status)
                      )}
                    </td>
                    <td className="transaction-id">
                      {payment.transactionId || "-"}
                    </td>
                    <td className="date-cell">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="actions-cell">
                      {editId === payment._id ? (
                        <>
                          <button
                            className="btn-save"
                            onClick={() => handleUpdate(payment._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(payment)}
                        >
                          Edit
                        </button>
                      )}
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
            totalItems={filteredPayments.length}
          />
        </>
      ) : (
        <div className="no-results">
          <p>No payments found</p>
          {Object.keys(activeFilters).length > 0 && (
            <button className="reset-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Payments;