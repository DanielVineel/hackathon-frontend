import React, { useEffect, useState } from "react";
import API from "../../api/api";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    API.get("/student/payments")
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