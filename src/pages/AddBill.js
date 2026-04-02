import React, { useState, useEffect } from "react";
import axios from "axios";

function AddBill() {
  const API = "https://bybills-backend-production.up.railway.app/api/bills";

  const [billName, setBillName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [networkError, setNetworkError] = useState("");

  const validate = () => {
    const e = {};
    if (!billName.trim()) e.billName = "Bill name is required";
    if (!amount || Number(amount) <= 0) e.amount = "Enter a valid amount";
    if (!dueDate) e.dueDate = "Due date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addBill = async () => {
    if (!validate()) return;
    setLoading(true);
    setNetworkError("");
    try {
      const bill = { billName, amount, dueDate };
      const res = await axios.post(API, bill);

      if (recurring) {
        const recurringBills = JSON.parse(localStorage.getItem("recurringBills") || "{}");
        recurringBills[res.data.id] = { recurring: true, frequency };
        localStorage.setItem("recurringBills", JSON.stringify(recurringBills));
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setBillName("");
      setAmount("");
      setDueDate("");
      setRecurring(false);
      setFrequency("monthly");
      setErrors({});
    } catch (err) {
      console.error(err);
      setNetworkError("❌ Failed to connect to backend. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "580px", margin: "0 auto", fontFamily: "'Nunito', sans-serif" }}>
      {success && (
        <div style={{
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          color: "#fff",
          borderRadius: "14px",
          padding: "14px 20px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: "700",
          fontSize: "14px",
          boxShadow: "0 4px 20px rgba(34,197,94,0.3)"
        }}>
          <span style={{ fontSize: "1.3rem" }}>✅</span>
          Bill added successfully!
        </div>
      )}

      {networkError && (
        <div style={{ color: "red", marginBottom: "16px" }}>{networkError}</div>
      )}

      <div style={{
        background: "#fff",
        borderRadius: "22px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
        overflow: "hidden"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #1e40af, #3b82f6, #38bdf8)",
          padding: "28px 32px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ position:"absolute", top:"-20px", right:"-20px", width:"100px", height:"100px", borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
          <div style={{ position:"absolute", bottom:"-30px", right:"60px", width:"70px", height:"70px", borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
          <div style={{ display:"flex", alignItems:"center", gap:"14px", position:"relative" }}>
            <div style={{
              width:"52px", height:"52px", borderRadius:"16px",
              background:"rgba(255,255,255,0.2)",
              backdropFilter:"blur(8px)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1.6rem"
            }}>➕</div>
            <div>
              <h2 style={{ margin:0, fontSize:"22px", fontWeight:"800", color:"#fff", letterSpacing:"-0.01em" }}>
                Add New Bill
              </h2>
              <p style={{ margin:"3px 0 0", fontSize:"13px", color:"rgba(255,255,255,0.75)", fontWeight:"500" }}>
                Fill in the details to track your bill
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding:"30px 32px" }}>
          <div style={{ marginBottom:"16px" }}>
            <label>Bill Name</label>
            <input 
              type="text" 
              value={billName} 
              onChange={e => setBillName(e.target.value)} 
              style={{ width:"100%", padding:"10px", borderRadius:"8px", border:"1px solid #ccc", marginTop:"6px" }}
            />
            {errors.billName && <p style={{ color:"red", fontSize:"12px" }}>{errors.billName}</p>}
          </div>

          <div style={{ marginBottom:"16px" }}>
            <label>Amount</label>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              style={{ width:"100%", padding:"10px", borderRadius:"8px", border:"1px solid #ccc", marginTop:"6px" }}
            />
            {errors.amount && <p style={{ color:"red", fontSize:"12px" }}>{errors.amount}</p>}
          </div>

          <div style={{ marginBottom:"16px" }}>
            <label>Due Date</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)} 
              style={{ width:"100%", padding:"10px", borderRadius:"8px", border:"1px solid #ccc", marginTop:"6px" }}
            />
            {errors.dueDate && <p style={{ color:"red", fontSize:"12px" }}>{errors.dueDate}</p>}
          </div>

          <div style={{ marginBottom:"16px" }}>
            <label>
              <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} /> Recurring
            </label>
            {recurring && (
              <select value={frequency} onChange={e => setFrequency(e.target.value)} style={{ marginTop:"6px", width:"100%", padding:"10px", borderRadius:"8px", border:"1px solid #ccc" }}>
                <option value="weekly">📅 Weekly</option>
                <option value="monthly">🗓 Monthly</option>
                <option value="yearly">📆 Yearly</option>
              </select>
            )}
          </div>

          <button 
            onClick={addBill} 
            disabled={loading} 
            style={{
              width:"100%", padding:"12px", border:"none", borderRadius:"10px",
              background:"#1e40af", color:"#fff", fontWeight:"700", fontSize:"16px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Adding..." : "Add Bill"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBill;
