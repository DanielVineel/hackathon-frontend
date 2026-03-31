import React, { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/student/PaymentHistory.css";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filters with bluto namespace
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(
    getBlutoStorage("student-payment-history-filters", {})
  );
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("student-payment-history-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("student-payment-history-sort", "createdAt")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("student-payment-history-sort-order", "desc")
  );

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/payments");
      setPayments(res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payment history");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = applyFilters(payments, {
    searchTerm,
    searchFields: ["eventName", "transactionId"],
    filters: activeFilters,
    sortBy,
    sortOrder,
  });

  const paginatedData = paginateArray(filteredPayments, currentPage, ITEMS_PER_PAGE);

  const handleFilterChange = (filters) => {
    setBlutoStorage("student-payment-history-filters", filters);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setBlutoStorage("student-payment-history-filters", {});
    setBlutoStorage("student-payment-history-search", "");
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("student-payment-history-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("student-payment-history-sort", field);
    setBlutoStorage("student-payment-history-sort-order", order);
    setCurrentPage(1);
  };

  const filterConfig = [
    {
      key: "status",
      type: "multiselect",
      label: "Payment Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
        { value: "failed", label: "Failed" },
        { value: "refunded", label: "Refunded" },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "warning",
      completed: "success",
      failed: "danger",
      refunded: "info",
    };
    const badgeClass = statusMap[status] || "secondary";
    return <span className={`badge badge-${badgeClass}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="payment-history-page">
        <div className="loading">Loading payment history...</div>
      </div>
    );
  }

  return (
    <div className="payment-history-page">
      <header className="page-header">
        <h1>Payment History</h1>
        <p>View all your event payments and transactions</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="payments-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by event or transaction ID..."
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

      {paginatedData.data.length > 0 ? (
        <>
          <div className="payments-table-wrapper">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.data.map((payment, index) => (
                  <tr key={payment._id}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td className="event-name">{payment.eventName}</td>
                    <td className="amount">₹{payment.amount?.toLocaleString()}</td>
                    <td>{getStatusBadge(payment.status)}</td>
                    <td className="transaction-id">
                      {payment.transactionId || "-"}
                    </td>
                    <td className="date">
                      {new Date(payment.createdAt).toLocaleDateString()}
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

export default PaymentHistory;