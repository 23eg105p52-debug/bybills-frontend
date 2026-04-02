import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
  const API = "http://localhost:8080/api/bills";
  const [bills, setBills] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get(API);
      setBills(res.data);
      setLoaded(true);
    } catch {
      setLoaded(true);
    }
  };

  const totalAmount = bills.reduce((sum, b) => sum + Number(b.amount), 0);

  const COLORS = [
    "#6c63ff", "#ff6584", "#43e97b", "#f7971e", "#00d2ff",
    "#a18cd1", "#fda085", "#f093fb", "#4facfe", "#43e97b",
    "#fa709a", "#fee140"
  ];

  const chartData = {
    labels: bills.map(b => b.billName),
    datasets: [{
      label: "Bills",
      data: bills.map(b => b.amount),
      backgroundColor: COLORS,
      borderWidth: 0,
      hoverOffset: 10,
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94a3b8",
          font: { family: "'Nunito', sans-serif", size: 12 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
        }
      },
      tooltip: {
        backgroundColor: "#0e1018",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        titleColor: "#e8e9f0",
        bodyColor: "#94a3b8",
        padding: 12,
        callbacks: {
          label: (ctx) => ` ₹ ${Number(ctx.raw).toLocaleString()}`
        }
      }
    }
  };

  const topBills = [...bills]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 3);

  return (
    <div className="dash-page" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s" }}>

      {/* ── PINTEREST-STYLE HERO HEADER ── */}
      <div className="dash-hero">
        <div className="hero-blob hero-blob1" />
        <div className="hero-blob hero-blob2" />
        <div className="hero-blob hero-blob3" />

        <div className="hero-inner">
          {/* Left: branding */}
          <div className="hero-left">
            <div className="hero-logo-mark">
              <span className="logo-icon">₿</span>
            </div>
            <div className="hero-text">
              <div className="hero-eyebrow">
                <span className="eyebrow-dot" />
                Personal Finance
              </div>
              <h1 className="hero-title">
                <span className="title-by">BY</span>
                <span className="title-bills">Bills</span>
              </h1>
              <p className="hero-tagline">Track • Manage • Never Miss a Bill</p>
            </div>
          </div>

          {/* Right: date + quick stats */}
          <div className="hero-right">
            <div className="hero-date">
              <span>📅</span>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
            <div className="hero-quick-stats">
              <div className="quick-stat">
                <span className="qs-val">{bills.length}</span>
                <span className="qs-label">Bills</span>
              </div>
              <div className="qs-divider" />
              <div className="quick-stat">
                <span className="qs-val">₹{totalAmount >= 1000 ? (totalAmount/1000).toFixed(1)+"k" : totalAmount}</span>
                <span className="qs-label">Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="dash-stats">
        <div className="stat-card">
          <div className="stat-icon">🧾</div>
          <div className="stat-info">
            <span className="stat-label">Total Bills</span>
            <span className="stat-value">{bills.length}</span>
          </div>
          <div className="stat-bar" style={{ background: "linear-gradient(90deg,#6c63ff,#36a2eb)" }} />
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Amount</span>
            <span className="stat-value">₹ {totalAmount.toLocaleString()}</span>
          </div>
          <div className="stat-bar" style={{ background: "linear-gradient(90deg,#43e97b,#38f9d7)" }} />
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-label">Avg per Bill</span>
            <span className="stat-value">
              ₹ {bills.length ? Math.round(totalAmount / bills.length).toLocaleString() : 0}
            </span>
          </div>
          <div className="stat-bar" style={{ background: "linear-gradient(90deg,#f7971e,#ffd200)" }} />
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="dash-grid">
        <div className="dash-panel">
          <div className="panel-header">
            <span className="panel-title">Spending Breakdown</span>
            <span className="panel-badge">{bills.length} categories</span>
          </div>
          <div className="chart-wrap">
            {bills.length > 0
              ? <Pie data={chartData} options={chartOptions} />
              : <div className="empty-state">No bills yet</div>
            }
          </div>
        </div>

        <div className="dash-panel">
          <div className="panel-header">
            <span className="panel-title">Top Expenses</span>
            <span className="panel-badge">Top 3</span>
          </div>
          <div className="top-bills">
            {topBills.length > 0 ? topBills.map((bill, i) => (
              <div className="top-bill-row" key={i}>
                <div className="top-bill-rank" style={{ background: COLORS[i] }}>{i + 1}</div>
                <div className="top-bill-info">
                  <span className="top-bill-name">{bill.billName}</span>
                  <div className="top-bill-bar-wrap">
                    <div className="top-bill-bar" style={{
                      width: `${(Number(bill.amount) / Number(topBills[0].amount)) * 100}%`,
                      background: COLORS[i]
                    }} />
                  </div>
                </div>
                <span className="top-bill-amt">₹{Number(bill.amount).toLocaleString()}</span>
              </div>
            )) : <div className="empty-state">No bills yet</div>}
          </div>

          <div className="panel-header" style={{ marginTop: "28px" }}>
            <span className="panel-title">All Bills</span>
          </div>
          <div className="mini-bill-list">
            {bills.map((bill, i) => (
              <div className="mini-bill-row" key={i}>
                <div className="mini-dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="mini-name">{bill.billName}</span>
                <span className="mini-amt">₹{Number(bill.amount).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Righteous&display=swap');

        .dash-page {
          font-family: 'Nunito', sans-serif;
          padding: 0 0 24px;
          color: #1e293b;
        }

        /* ── HERO ── */
        .dash-hero {
          position: relative;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%);
          border-radius: 24px;
          margin-bottom: 28px;
          overflow: hidden;
          padding: 32px 36px;
        }
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(65px);
          pointer-events: none;
        }
        .hero-blob1 { width:280px; height:280px; background:#6c63ff; top:-80px; left:-60px; opacity:0.28; }
        .hero-blob2 { width:200px; height:200px; background:#ff6584; bottom:-60px; right:130px; opacity:0.18; }
        .hero-blob3 { width:160px; height:160px; background:#43e97b; top:10px; right:-30px; opacity:0.13; }

        .hero-inner {
          position: relative; z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .hero-left { display: flex; align-items: center; gap: 20px; }

        .hero-logo-mark {
          width: 68px; height: 68px;
          border-radius: 20px;
          background: linear-gradient(135deg, #6c63ff, #a78bfa);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 32px rgba(108,99,255,0.55);
          border: 2px solid rgba(255,255,255,0.15);
          flex-shrink: 0;
        }
        .logo-icon {
          font-size: 30px;
          color: #fff;
          font-family: 'Righteous', cursive;
          line-height: 1;
        }

        .hero-eyebrow {
          display: flex; align-items: center; gap: 7px;
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #a78bfa; margin-bottom: 6px;
        }
        .eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%,100% { opacity:1; } 50% { opacity:0.25; }
        }

        .hero-title {
          margin: 0 0 6px; line-height: 1.05;
          font-family: 'Righteous', cursive;
        }
        .title-by {
          font-size: 48px; color: #fff; font-weight: 400;
        }
        .title-bills {
          font-size: 48px; font-weight: 400;
          background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-tagline {
          margin: 0;
          font-size: 12.5px;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        .hero-right {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 12px;
        }
        .hero-date {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: rgba(255,255,255,0.5);
          font-weight: 600;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 8px 14px;
        }
        .hero-quick-stats {
          display: flex; align-items: center; gap: 18px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px; padding: 14px 22px;
        }
        .quick-stat { display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .qs-val { font-size: 22px; font-weight: 900; color: #fff; line-height: 1; }
        .qs-label {
          font-size: 9.5px; color: rgba(255,255,255,0.4);
          font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .qs-divider { width:1px; height:34px; background:rgba(255,255,255,0.15); }

        /* ── STAT CARDS ── */
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 18px; margin-bottom: 24px;
        }
        .stat-card {
          background: #fff; border-radius: 18px; padding: 22px 24px 0;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          display: flex; align-items: center; gap: 16px;
          flex-wrap: wrap; overflow: hidden;
          animation: slideUp 0.5s cubic-bezier(.22,1,.36,1) both;
        }
        .stat-card:nth-child(1) { animation-delay: 0.05s; }
        .stat-card:nth-child(2) { animation-delay: 0.12s; }
        .stat-card:nth-child(3) { animation-delay: 0.19s; }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .stat-icon {
          font-size: 1.8rem; width:52px; height:52px;
          display:flex; align-items:center; justify-content:center;
          border-radius:14px; background:#f8fafc; flex-shrink:0;
        }
        .stat-info { display:flex; flex-direction:column; gap:2px; padding-bottom:18px; }
        .stat-label { font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#94a3b8; font-weight:700; }
        .stat-value { font-size:26px; font-weight:800; color:#1e293b; letter-spacing:-0.01em; }
        .stat-bar { width:100%; height:3px; border-radius:0; margin-top:auto; flex-basis:100%; }

        /* ── PANELS ── */
        .dash-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        @media (max-width:860px) {
          .dash-grid { grid-template-columns:1fr; }
          .hero-right { align-items:flex-start; }
          .title-by, .title-bills { font-size:36px; }
        }
        .dash-panel {
          background:#fff; border-radius:20px; padding:24px;
          border:1px solid #e5e7eb;
          box-shadow:0 4px 20px rgba(0,0,0,0.05);
          animation:slideUp 0.5s cubic-bezier(.22,1,.36,1) 0.2s both;
        }
        .panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
        .panel-title { font-size:15px; font-weight:800; color:#1e293b; }
        .panel-badge {
          font-size:11px; font-weight:700; color:#6c63ff;
          background:rgba(108,99,255,0.08);
          border:1px solid rgba(108,99,255,0.2);
          border-radius:20px; padding:3px 10px;
        }
        .chart-wrap { max-width:340px; margin:0 auto; }
        .empty-state { text-align:center; color:#94a3b8; padding:40px 0; font-size:14px; }

        .top-bills { display:flex; flex-direction:column; gap:16px; }
        .top-bill-row { display:flex; align-items:center; gap:12px; }
        .top-bill-rank {
          width:26px; height:26px; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
          font-size:12px; font-weight:800; color:#fff; flex-shrink:0;
        }
        .top-bill-info { flex:1; }
        .top-bill-name { display:block; font-size:13px; font-weight:600; color:#374151; margin-bottom:5px; text-transform:capitalize; }
        .top-bill-bar-wrap { height:5px; background:#f1f5f9; border-radius:4px; overflow:hidden; }
        .top-bill-bar { height:100%; border-radius:4px; transition:width 0.8s cubic-bezier(.22,1,.36,1); }
        .top-bill-amt { font-size:13px; font-weight:800; color:#1e293b; white-space:nowrap; }

        .mini-bill-list { display:flex; flex-direction:column; gap:8px; max-height:200px; overflow-y:auto; padding-right:4px; }
        .mini-bill-list::-webkit-scrollbar { width:4px; }
        .mini-bill-list::-webkit-scrollbar-track { background:#f1f5f9; border-radius:4px; }
        .mini-bill-list::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:4px; }
        .mini-bill-row {
          display:flex; align-items:center; gap:10px;
          padding:8px 10px; border-radius:10px;
          background:#f8fafc; transition:background 0.15s;
        }
        .mini-bill-row:hover { background:#f1f5f9; }
        .mini-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
        .mini-name { flex:1; font-size:13px; color:#374151; text-transform:capitalize; }
        .mini-amt { font-size:13px; font-weight:700; color:#1e293b; }
      `}</style>
    </div>
  );
}

export default Home;