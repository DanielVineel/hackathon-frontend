import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { getToken } from "../../utils/auth";

const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const token = getToken();

  useEffect(() => {
    API.get("/certificates/my-certificates", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setCerts(res.data.certificates))
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <div>
      <h2>Certificates</h2>
      {certs.length === 0 && <p>No certificates found</p>}
      {certs.map((c) => (
        <div key={c._id} className="border p-2 mb-2">
          <h5>{c.eventName}</h5>
          <a href={c.pdfUrl} target="_blank" rel="noreferrer">
            View PDF
          </a>
        </div>
      ))}
    </div>
  );
};

export default Certificates;