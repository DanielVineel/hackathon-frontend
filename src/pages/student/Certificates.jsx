// src/pages/student/Certificates.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Certificates = () => {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    API.get("/certificates/my-certificates")
      .then(res => setCerts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Certificates</h2>
      {certs.map(c => (
        <div key={c._id} className="border p-2 mb-2">
          <h5>{c.eventName}</h5>
          <a href={c.pdfUrl} target="_blank" rel="noreferrer">View PDF</a>
        </div>
      ))}
    </div>
  );
};

export default Certificates;