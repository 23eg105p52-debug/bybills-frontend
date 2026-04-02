import React, { useState } from "react";
import axios from "axios";

function AddBill() {
  const API = "http://localhost:8080/api/bills";

  const [billName, setBillName] = useState("");
  const [amount, setAmount]     = useState("");
  const [dueDate, setDueDate]   = useState("");
  const [recurring, setRecurring]   = useState(false);
  const [frequency, setFrequency]   = useState("monthly");
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [errors, setErrors]         = useState({});

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
      setBillName(""); setAmount(""); setDueDate("");
      setRecurring(false); setFrequency("monthly"); setErrors({});
    } catch {
      alert("❌ Failed to add bill. Please try again.");
    }
    setLoading(false);
  };

  const freqOptions = [
    { value: "weekly",  label: "Weekly",  icon: "📅" },
    { value: "monthly", label: "Monthly", icon: "🗓" },
    { value: "yearly",  label: "Yearly",  icon: "📆" },
  ];

  return (
    <div style={{ maxWidth: "580px", margin: "0 auto", fontFamily: "'Nunito', sans-serif" }}>

      {/* Success Banner */}
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
          boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
          animation: "slideDown 0.4s cubic-bezier(.22,1,.36,1)"
        }}>
          <span style={{ fontSize: "1.3rem" }}>✅</span>
          Bill added successfully!
        </div>
      )}

      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: "22px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
        overflow: "hidden"
      }}>

        {/* Card Top Banner */}
        <div style={{
          background: "linear-gradient(135deg, #1e40af, #3b82f6, #38bdf8)",
          padding: "28px 32px",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* decorative circles */}
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

        {/* Form Body */}
        <div style={{ padding:"30px 32px" }}>

          {/* Bill Name */}
          <div style={{ marginBottom:"20px" }}>
            <label style={labelSt}>
              <span style={iconSt}>📝</span> Bill Name
            </label>
            <input
              type="text"
              placeholder="e.g. Electricity, Rent, Netflix..."
              value={billName}
              onChange={e => { setBillName(e.target.value); setErrors(p=>({...p,billName:""})); }}
              style={{ ...inputSt, borderColor: errors.billName ? "#ef4444" : "#e5e7eb" }}
            />
            {errors.billName && <p style={errSt}>{errors.billName}</p>}
          </div>

          {/* Amount */}
          <div style={{ marginBottom:"20px" }}>
            <label style={labelSt}>
              <span style={iconSt}>💰</span> Amount (₹)
            </label>
            <div style={{ position:"relative" }}>
              <span style={{
                position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)",
                fontSize:"15px", fontWeight:"700", color:"#64748b"
              }}>₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => { setAmount(e.target.value); setErrors(p=>({...p,amount:""})); }}
                style={{ ...inputSt, paddingLeft:"32px", borderColor: errors.amount ? "#ef4444" : "#e5e7eb" }}
              />
            </div>
            {errors.amount && <p style={errSt}>{errors.amount}</p>}
          </div>

          {/* Due Date */}
          <div style={{ marginBottom:"20px" }}>
            <label style={labelSt}>
              <span style={iconSt}>📅</span> Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => { setDueDate(e.target.value); setErrors(p=>({...p,dueDate:""})); }}
              style={{ ...inputSt, borderColor: errors.dueDate ? "#ef4444" : "#e5e7eb" }}
            />
            {errors.dueDate && <p style={errSt}>{errors.dueDate}</p>}
          </div>

          {/* Divider */}
          <div style={{ height:"1px", background:"#f1f5f9", margin:"4px 0 20px" }} />

          {/* Recurring Toggle */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"16px 18px", borderRadius:"14px",
            background: recurring ? "rgba(59,130,246,0.06)" : "#f8fafc",
            border: `1.5px solid ${recurring ? "rgba(59,130,246,0.3)" : "#e5e7eb"}`,
            marginBottom: recurring ? "16px" : "24px",
            transition:"all 0.3s"
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <div style={{
                width:"38px", height:"38px", borderRadius:"10px",
                background: recurring ? "rgba(59,130,246,0.12)" : "#ede9fe",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"1.1rem"
              }}>🔄</div>
              <div>
                <p style={{ margin:0, fontWeight:"700", color:"#1e293b", fontSize:"14px" }}>Recurring Bill?</p>
                <p style={{ margin:"2px 0 0", fontSize:"12px", color:"#94a3b8" }}>Auto-repeats on schedule</p>
              </div>
            </div>
            {/* Toggle */}
            <div onClick={() => setRecurring(!recurring)} style={{
              width:"48px", height:"28px", borderRadius:"50px",
              background: recurring ? "#3b82f6" : "#d1d5db",
              position:"relative", cursor:"pointer",
              transition:"background 0.3s", flexShrink:0,
              boxShadow: recurring ? "0 0 0 3px rgba(59,130,246,0.2)" : "none"
            }}>
              <div style={{
                position:"absolute", top:"4px",
                left: recurring ? "24px" : "4px",
                width:"20px", height:"20px",
                borderRadius:"50%", background:"#fff",
                transition:"left 0.3s",
                boxShadow:"0 1px 4px rgba(0,0,0,0.2)"
              }} />
            </div>
          </div>

          {/* Frequency Selector */}
          {recurring && (
            <div style={{ marginBottom:"24px" }}>
              <label style={labelSt}>
                <span style={iconSt}>🗓</span> Frequency
              </label>
              <div style={{ display:"flex", gap:"10px" }}>
                {freqOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFrequency(opt.value)}
                    style={{
                      flex:1, padding:"10px 8px",
                      borderRadius:"12px",
                      border: `2px solid ${frequency === opt.value ? "#3b82f6" : "#e5e7eb"}`,
                      background: frequency === opt.value ? "rgba(59,130,246,0.08)" : "#f8fafc",
                      color: frequency === opt.value ? "#3b82f6" : "#64748b",
                      fontWeight: frequency === opt.value ? "700" : "500",
                      fontSize:"13px", cursor:"pointer",
                      transition:"all 0.2s",
                      transform:"none",
                      boxShadow:"none",
                      display:"flex", flexDirection:"column",
                      alignItems:"center", gap:"4px"
                    }}
                  >
                    <span style={{ fontSize:"1.1rem" }}>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={addBill}
            disabled={loading}
            style={{
              width:"100%", padding:"15px",
              borderRadius:"14px",
              background: loading
                ? "#94a3b8"
                : "linear-gradient(135deg, #1e40af, #3b82f6)",
              color:"#fff",
              fontSize:"15px", fontWeight:"800",
              border:"none", cursor: loading ? "not-allowed" : "pointer",
              letterSpacing:"0.3px",
              boxShadow: loading ? "none" : "0 6px 24px rgba(59,130,246,0.38)",
              transition:"all 0.2s",
              display:"flex", alignItems:"center",
              justifyContent:"center", gap:"8px"
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.4)",
                  borderTopColor:"#fff", borderRadius:"50%",
                  display:"inline-block", animation:"spin 0.7s linear infinite"
                }} />
                Adding Bill...
              </>
            ) : (
              <> ➕ Add Bill </>
            )}
          </button>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer; opacity: 0.6;
        }
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}

/* Shared micro-styles */
const labelSt = {
  display:"flex", alignItems:"center", gap:"6px",
  fontWeight:"700", color:"#374151",
  marginBottom:"8px", fontSize:"13.5px"
};
const iconSt = { fontSize:"1rem" };
const inputSt = {
  width:"100%", padding:"13px 16px",
  borderRadius:"12px", border:"1.5px solid #e5e7eb",
  fontSize:"14px", color:"#1e293b",
  background:"#f8fafc", outline:"none",
  boxSizing:"border-box", display:"block",
  fontFamily:"'Nunito', sans-serif", fontWeight:"500",
  transition:"border-color 0.2s, box-shadow 0.2s"
};
const errSt = {
  margin:"5px 0 0", fontSize:"12px",
  color:"#ef4444", fontWeight:"600"
};

export default AddBill;