import React, { useState, useEffect } from "react";
import axios from "axios";

function Bills() {
  const API = "https://bybills-backend-production.up.railway.app/api/bills";
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBills = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API);
      setBills(res.data);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch bills. Please check your backend.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bills</h2>
      {loading && <p>Loading bills...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && bills.length === 0 && <p>No bills found.</p>}
      {!loading && !error && bills.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc" }}>
              <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Amount</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{bill.billName}</td>
                <td style={{ padding: "8px" }}>{bill.amount}</td>
                <td style={{ padding: "8px" }}>{bill.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Bills;
