import React, { useEffect, useState } from "react";
import axios from "axios";
function Bills() {
  const API = "https://bybills-backend-production.up.railway.app/api/bills";
  const [bills, setBills] = useState([]);
  const recurringBills = JSON.parse(localStorage.getItem("recurringBills") || "{}");
  useEffect(() => {
    fetchBills();
  }, []);
  useEffect(() => {
    if (bills.length === 0) return;
    const today = new Date().toISOString().split("T")[0];
    const dueBills = bills.filter(b => b.dueDate === today);
    if (dueBills.length > 0) {
      const names = dueBills.map(b => b.billName).join(", ");
      new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();
      alert("⚠ Bills Due Today: " + names);
    }
  }, [bills]);
  const fetchBills = async () => {
    const res = await axios.get(API);
    setBills(res.data);
  };
  const handlePayment = (id) => {
    alert("✅ Payment Successful!");
    const updatedBills = bills.map(b =>
      b.id === id ? { ...b, status: "Paid" } : b
    );
    setBills(updatedBills);
  };
  return (
    <div className="card">
      <h2>All Bills</h2>
      <table>
        <thead>
          <tr>
            <th>Bill</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Recurring</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(b => {
            const info = recurringBills[b.id];
            return (
              <tr key={b.id}>
                <td>{b.billName}</td>
                <td>₹ {b.amount}</td>
                <td>{b.dueDate}</td>
                <td>
                  {info?.recurring ? (
                    <span style={{
                      background: "#e0f2fe",
                      color: "#0369a1",
                      fontSize: "12px",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontWeight: "600",
                      whiteSpace: "nowrap"
                    }}>
                      🔄 {info.frequency}
                    </span>
                  ) : (
                    <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                      — one-time
                    </span>
                  )}
                </td>
                <td>
                  {b.status === "Paid" ? "🟢 Paid" : "🔴 Pending"}
                </td>
                <td>
                  {b.status !== "Paid" && (
                    <button onClick={() => handlePayment(b.id)}>
                      💳 Pay
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default Bills;
