import React, { useEffect, useState } from "react";
import axios from "axios";

function Status() {
  const API = "http://localhost:8080/api/bills";
  const [bills, setBills] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get(API);
      setBills(res.data);
    } catch (e) {}
    setLoaded(true);
  };

  const today = new Date().toISOString().split("T")[0];
  const overdue  = bills.filter(b => b.dueDate < today);
  const dueToday = bills.filter(b => b.dueDate === today);
  const upcoming = bills.filter(b => b.dueDate > today);

  // Days overdue / days until due
  const daysDiff = (dateStr) => {
    const diff = Math.round((new Date(dateStr) - new Date(today)) / 86400000);
    return diff;
  };

  const StatusSection = ({ title, icon, bills, type, emptyMsg }) => {
    const cfg = {
      overdue:  { badge: "#fee2e2", badgeText: "#dc2626", row: "#fff5f5", border: "#fecaca", tag: "#ef4444", tagBg: "#fee2e2" },
      today:    { badge: "#fef3c7", badgeText: "#d97706", row: "#fffdf0", border: "#fde68a", tag: "#d97706", tagBg: "#fef3c7" },
      upcoming: { badge: "#dcfce7", badgeText: "#15803d", row: "#f0fdf4", border: "#86efac", tag: "#16a34a", tagBg: "#dcfce7" },
    }[type];

    return (
      <div className="status-section">
        <div className="ss-header">
          <div className="ss-title-wrap">
            <span className="ss-icon">{icon}</span>
            <span className="ss-title">{title}</span>
          </div>
          <span className="ss-badge" style={{ background: cfg.badge, color: cfg.badgeText }}>
            {bills.length} bill{bills.length !== 1 ? "s" : ""}
          </span>
        </div>

        {bills.length === 0 ? (
          <div className="ss-empty">{emptyMsg}</div>
        ) : (
          <div className="ss-list">
            {bills.map((b, i) => {
              const diff = daysDiff(b.dueDate);
              const tagText = type === "overdue"
                ? `${Math.abs(diff)}d overdue`
                : type === "today"
                ? "Due today"
                : `In ${diff}d`;

              return (
                <div className="ss-row" key={b.id || i}
                  style={{ background: cfg.row, borderColor: cfg.border, animationDelay: `${i * 0.05}s` }}>
                  <div className="ss-row-left">
                    <div className="ss-bill-name">{b.billName}</div>
                    <div className="ss-bill-date">📅 Due: {b.dueDate}</div>
                  </div>
                  <div className="ss-row-right">
                    <span className="ss-tag" style={{ background: cfg.tagBg, color: cfg.tag }}>{tagText}</span>
                    <span className="ss-amount">₹ {Number(b.amount).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="status-page" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s" }}>

      {/* Page Header */}
      <div className="status-header">
        <div>
          <div className="status-eyebrow">Bills Tracker</div>
          <h1 className="status-title">Payment Status</h1>
          <p className="status-sub">Stay on top of every due date</p>
        </div>
        <div className="status-today-badge">
          📅 {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="status-summary">

        <div className="sum-card" style={{ animationDelay: "0.05s" }}>
          <div className="sum-icon" style={{ background: "#fee2e2" }}>🔴</div>
          <div className="sum-info">
            <span className="sum-label">Overdue</span>
            <span className="sum-value" style={{ color: "#ef4444" }}>{overdue.length}</span>
          </div>
          <div className="sum-bar" style={{ background: "linear-gradient(90deg,#ef4444,#fca5a5)" }} />
        </div>

        <div className="sum-card" style={{ animationDelay: "0.1s" }}>
          <div className="sum-icon" style={{ background: "#fef3c7" }}>🟡</div>
          <div className="sum-info">
            <span className="sum-label">Due Today</span>
            <span className="sum-value" style={{ color: "#f59e0b" }}>{dueToday.length}</span>
          </div>
          <div className="sum-bar" style={{ background: "linear-gradient(90deg,#f59e0b,#fde68a)" }} />
        </div>

        <div className="sum-card" style={{ animationDelay: "0.15s" }}>
          <div className="sum-icon" style={{ background: "#dcfce7" }}>🟢</div>
          <div className="sum-info">
            <span className="sum-label">Upcoming</span>
            <span className="sum-value" style={{ color: "#22c55e" }}>{upcoming.length}</span>
          </div>
          <div className="sum-bar" style={{ background: "linear-gradient(90deg,#22c55e,#86efac)" }} />
        </div>

        <div className="sum-card" style={{ animationDelay: "0.2s" }}>
          <div className="sum-icon" style={{ background: "#ede9fe" }}>💸</div>
          <div className="sum-info">
            <span className="sum-label">Overdue Amt</span>
            <span className="sum-value" style={{ color: "#7c3aed", fontSize: "18px" }}>
              ₹{overdue.reduce((s, b) => s + Number(b.amount), 0).toLocaleString()}
            </span>
          </div>
          <div className="sum-bar" style={{ background: "linear-gradient(90deg,#7c3aed,#c4b5fd)" }} />
        </div>

      </div>

      {/* Status Sections */}
      <StatusSection title="Overdue Bills"   icon="🔴" bills={overdue}  type="overdue"  emptyMsg="✅ No overdue bills — you're all caught up!" />
      <StatusSection title="Due Today"       icon="🟡" bills={dueToday} type="today"    emptyMsg="👍 Nothing due today — enjoy your day!" />
      <StatusSection title="Upcoming Bills"  icon="🟢" bills={upcoming} type="upcoming" emptyMsg="📭 No upcoming bills scheduled" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

        .status-page {
          font-family: 'Nunito', sans-serif;
          padding: 8px 4px;
          color: #1e293b;
        }

        /* Header */
        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .status-eyebrow {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6c63ff;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .status-title {
          font-family: 'Nunito', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 3px;
          letter-spacing: -0.01em;
        }
        .status-sub {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
        }
        .status-today-badge {
          font-size: 12.5px;
          color: #64748b;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 14px;
          font-weight: 600;
        }

        /* Summary cards */
        .status-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .sum-card {
          background: #fff;
          border-radius: 16px;
          padding: 18px 20px 0;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          overflow: hidden;
          animation: slideUp 0.5s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .sum-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .sum-info {
          display: flex; flex-direction: column; gap: 1px;
          padding-bottom: 16px;
          flex: 1;
        }
        .sum-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #94a3b8;
          font-weight: 700;
        }
        .sum-value {
          font-family: 'Nunito', sans-serif;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .sum-bar {
          width: 100%;
          height: 3px;
          flex-basis: 100%;
          border-radius: 0;
        }

        /* Status section */
        .status-section {
          background: #fff;
          border-radius: 18px;
          padding: 22px 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          margin-bottom: 18px;
          animation: slideUp 0.5s cubic-bezier(.22,1,.36,1) both;
        }
        .ss-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .ss-title-wrap {
          display: flex; align-items: center; gap: 8px;
        }
        .ss-icon { font-size: 1rem; }
        .ss-title {
          font-size: 15px;
          font-weight: 800;
          color: #1e293b;
        }
        .ss-badge {
          font-size: 11.5px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
        }
        .ss-empty {
          text-align: center;
          padding: 22px;
          font-size: 13.5px;
          color: #94a3b8;
          background: #f8fafc;
          border-radius: 12px;
          font-weight: 600;
        }
        .ss-list {
          display: flex; flex-direction: column; gap: 10px;
        }
        .ss-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid;
          animation: slideUp 0.4s cubic-bezier(.22,1,.36,1) both;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .ss-row:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .ss-row-left { display: flex; flex-direction: column; gap: 3px; }
        .ss-bill-name {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          text-transform: capitalize;
        }
        .ss-bill-date {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }
        .ss-row-right {
          display: flex; flex-direction: column; align-items: flex-end; gap: 5px;
        }
        .ss-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 9px;
          border-radius: 20px;
          letter-spacing: 0.02em;
        }
        .ss-amount {
          font-size: 15px;
          font-weight: 800;
          color: #1e293b;
        }
      `}</style>
    </div>
  );
}

export default Status;