import React, { useState } from "react";
import PaymentRow from "./PaymentRow";

const PaymentsTable = ({ data, currentPage, itemsPerPage, refresh }) => {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ status: "" });

  return (
    <table className="payments-table">
      <thead>
        <tr>
          <th>#</th>
          <th>User</th>
          <th>Event</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Txn</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((p, i) => (
          <PaymentRow
            key={p._id}
            payment={p}
            index={i}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            editId={editId}
            setEditId={setEditId}
            editData={editData}
            setEditData={setEditData}
            refresh={refresh}
          />
        ))}
      </tbody>
    </table>
  );
};

export default PaymentsTable;