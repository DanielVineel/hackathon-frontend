import React from "react";
import API from "../../api/api";

const PaymentRow = ({
  payment,
  index,
  currentPage,
  itemsPerPage,
  editId,
  setEditId,
  editData,
  setEditData,
  refresh,
}) => {
  const handleUpdate = async () => {
    await API.put(`/superadmin/payment/${payment._id}`, editData);
    setEditId(null);
    refresh();
  };

  return (
    <tr>
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{payment.user?.name}</td>
      <td>{payment.event?.name}</td>
      <td>₹{payment.amount}</td>

      <td>
        {editId === payment._id ? (
          <select
            value={editData.status}
            onChange={(e) =>
              setEditData({ status: e.target.value })
            }
          >
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        ) : (
          payment.status
        )}
      </td>

      <td>{payment.transactionId}</td>
      <td>{new Date(payment.createdAt).toLocaleDateString()}</td>

      <td>
        {editId === payment._id ? (
          <>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditId(null)}>Cancel</button>
          </>
        ) : (
          <button
            onClick={() => {
              setEditId(payment._id);
              setEditData({ status: payment.status });
            }}
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
};

export default PaymentRow;