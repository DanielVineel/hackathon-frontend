import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { getToken } from "../../utils/auth";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const token=getToken();

  useEffect(() => {
    API.get("/payments/my",{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setPayments(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Payment History</h2>
      {payments.map(p => (
        <div key={p._id} className="border p-2 mb-2">
          Event: {p.eventName} - Amount: {p.amount} - Status: {p.status}
        </div>
      ))}
    </div>
  );
};

export default PaymentHistory;