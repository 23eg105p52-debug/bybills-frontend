import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const CATEGORY_ICONS = {
  Entertainment: "🎬",
  Utilities: "⚡",
  Shopping: "🛍️",
  Health: "💪",
  Tech: "☁️",
  Food: "🍔",
  Rent: "🏠",
  default: "📦",
};

function CalendarView() {
  const [date, setDate]     = useState(new Date());
  const [bills, setBills]   = useState([]);
  const [loading, setLoading] = useState(true);

  const API   = "http://localhost:8080/api/bills";
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get(API);
      setBills(res.data);
    } catch (e) {
      console.error("Failed to fetch bills", e);
    } finally {
      setLoading(false);
    }
  };

  const hasBill = (day) =>
    bills.some((b) => new Date(b.dueDate).toDateString() === day.toDateString());

  const selectedBills = bills.filter(
    (b) => new Date(b.dueDate).toDateString() === date.toDateString()
  );

  const totalDue      = selectedBills.reduce((s, b) => s + Number(b.amount), 0);
  const overdueBills  = bills.filter((b) => b.dueDate < today);
  const upcomingBills = bills.filter((b) => b.dueDate > today);
  const totalOverdue  = overdueBills.reduce((s, b) => s + Number(b.amount), 0);

  const getStatus = (dueDate) => {
    if (dueDate === today) return "today";
    if (dueDate < today)  return "overdue";
    return "upcoming";
  };

  const statusConfig = {
    today:    { label: "Due Today", bg: "#eef2ff", border: "#c7d2fe", badge: "#4338ca", badgeBg: "#e0e7ff" },
    overdue:  { label: "Overdue",   bg: "#fef2f2", border: "#fecaca", badge: "#dc2626", badgeBg: "#fee2e2" },
    upcoming: { label: "Upcoming",  bg: "#f0fdf4", border: "#bbf7d0", badge: "#15803d", badgeBg: "#dcfce7" },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

        .cal-root { font-family: 'Nunito', sans-serif; }
        .cal-root * { font-family: 'Nunito', sans-serif; box-sizing: border-box; }

        /* ── Calendar overrides ── */
        .bybills-cal { width: 100% !important; border: none !important; background: transparent !important; }
        .bybills-cal .react-calendar__navigation { margin-bottom: 8px !important; }
        .bybills-cal .react-calendar__navigation button {
          font-size: 14px !important; font-weight: 800 !important; color: #1e293b !important;
          background: transparent !important; border-radius: 10px !important;
          min-width: 36px !important; transition: all 0.15s !important;
          font-family: 'Nunito', sans-serif !important;
        }
        .bybills-cal .react-calendar__navigation button:hover {
          background: #eef2ff !important; color: #6366f1 !important;
        }
        .bybills-cal .react-calendar__navigation button:disabled {
          background: transparent !important; color: #d1d5db !important;
        }
        .bybills-cal .react-calendar__month-view__weekdays { margin-bottom: 4px !important; }
        .bybills-cal .react-calendar__month-view__weekdays__weekday {
          text-align: center !important; font-size: 10px !important; font-weight: 800 !important;
          letter-spacing: 1.2px !important; color: #94a3b8 !important; padding: 4px 0 10px !important;
          text-transform: uppercase !important;
        }
        .bybills-cal .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none !important; }
        .bybills-cal .react-calendar__tile {
          border-radius: 10px !important; padding: 10px 4px !important;
          font-size: 13px !important; font-weight: 600 !important; color: #374151 !important;
          background: transparent !important; transition: all 0.15s ease !important;
          line-height: 1.4 !important; font-family: 'Nunito', sans-serif !important;
        }
        .bybills-cal .react-calendar__tile:hover:not(.react-calendar__tile--active) {
          background: #f1f5f9 !important; color: #1e293b !important;
        }
        .bybills-cal .react-calendar__tile--now {
          background: #fef3c7 !important; color: #b45309 !important;
          font-weight: 800 !important; outline: 2px solid #fde68a !important;
        }
        .bybills-cal .react-calendar__tile--active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
          color: #fff !important; font-weight: 800 !important;
          box-shadow: 0 4px 14px rgba(99,102,241,0.4) !important; outline: none !important;
        }
        .bybills-cal .react-calendar__tile--active:hover {
          background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
        }
        .bybills-cal .react-calendar__month-view__days__day--weekend { color: #f87171 !important; }
        .bybills-cal .react-calendar__tile--active abbr { color: #fff !important; }
        .bybills-cal .react-calendar__month-view__days__day--neighboringMonth {
          color: #e2e8f0 !important;
        }

        .bill-row { transition: all 0.18s ease; }
        .bill-row:hover { transform: translateX(4px); box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important; }

        .sum-card { transition: all 0.18s ease; }
        .sum-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.1) !important; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
      `}</style>

      <div className="cal-root" style={{ display:"flex", gap:"22px", alignItems:"flex-start", flexWrap:"wrap" }}>

        {/* ── LEFT: Calendar ── */}
        <div style={{
          flex:1, minWidth:"300px",
          background:"#fff", borderRadius:"22px",
          border:"1px solid #e5e7eb",
          boxShadow:"0 4px 24px rgba(0,0,0,0.06)",
          overflow:"hidden"
        }}>
          {/* Header banner */}
          <div style={{
            background:"linear-gradient(135deg, #4f46e5, #7c3aed)",
            padding:"22px 26px",
            position:"relative", overflow:"hidden"
          }}>
            <div style={{ position:"absolute", top:"-16px", right:"-16px", width:"80px", height:"80px", borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
            <div style={{ position:"absolute", bottom:"-20px", right:"50px", width:"55px", height:"55px", borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
            <div style={{ display:"flex", alignItems:"center", gap:"12px", position:"relative" }}>
              <div style={{
                width:"44px", height:"44px", borderRadius:"13px",
                background:"rgba(255,255,255,0.18)", backdropFilter:"blur(8px)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem"
              }}>📅</div>
              <div>
                <h2 style={{ margin:0, fontSize:"18px", fontWeight:"800", color:"#fff" }}>Bills Calendar</h2>
                <p style={{ margin:"3px 0 0", fontSize:"12px", color:"rgba(255,255,255,0.7)", fontWeight:"500" }}>
                  Click any date to see bills due
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display:"flex", gap:"18px", flexWrap:"wrap",
            padding:"14px 24px", background:"#f9fafb",
            borderBottom:"1px solid #f1f5f9"
          }}>
            {[["#6366f1","Upcoming"],["#ef4444","Overdue"],["#f59e0b","Today"]].map(([c,l]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"11.5px", color:"#64748b", fontWeight:"600" }}>
                <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:c, display:"inline-block", boxShadow:`0 0 0 3px ${c}33` }} />
                {l}
              </div>
            ))}
          </div>

          {/* Calendar widget */}
          <div style={{ padding:"18px 20px 22px" }}>
            <Calendar
              className="bybills-cal"
              onChange={setDate}
              value={date}
              tileContent={({ date: tileDate, view }) => {
                if (view !== "month" || !hasBill(tileDate)) return null;
                const ts = tileDate.toISOString().split("T")[0];
                const dotColor = ts === today ? "#f59e0b" : ts < today ? "#ef4444" : "#6366f1";
                return (
                  <div style={{ display:"flex", justifyContent:"center", marginTop:"3px" }}>
                    <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:dotColor, display:"inline-block" }} />
                  </div>
                );
              }}
            />
          </div>
        </div>

        {/* ── RIGHT: Summary + Bills ── */}
        <div style={{ width:"330px", flexShrink:0, display:"flex", flexDirection:"column", gap:"16px" }}>

          {/* 3 stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>
            {[
              { label:"Overdue",   value:overdueBills.length,  icon:"🔴", color:"#ef4444", bg:"#fef2f2", border:"#fecaca" },
              { label:"Today",     value:selectedBills.length, icon:"🟡", color:"#d97706", bg:"#fffbeb", border:"#fde68a" },
              { label:"Upcoming",  value:upcomingBills.length, icon:"🟢", color:"#16a34a", bg:"#f0fdf4", border:"#86efac" },
            ].map((c) => (
              <div key={c.label} className="sum-card" style={{
                background:c.bg, borderRadius:"14px", padding:"14px 12px",
                border:`1px solid ${c.border}`,
                boxShadow:"0 2px 10px rgba(0,0,0,0.04)",
                textAlign:"center"
              }}>
                <div style={{ fontSize:"1.2rem", marginBottom:"6px" }}>{c.icon}</div>
                <div style={{ fontSize:"22px", fontWeight:"800", color:c.color }}>{c.value}</div>
                <div style={{ fontSize:"10px", fontWeight:"700", color:c.color, opacity:0.7, marginTop:"2px", textTransform:"uppercase", letterSpacing:"0.05em" }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Overdue amount card */}
          {overdueBills.length > 0 && (
            <div style={{
              background:"linear-gradient(135deg, #ef4444, #f87171)",
              borderRadius:"16px", padding:"16px 18px",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              boxShadow:"0 4px 20px rgba(239,68,68,0.28)"
            }}>
              <div>
                <div style={{ fontSize:"11px", fontWeight:"700", color:"rgba(255,255,255,0.75)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Overdue Amount</div>
                <div style={{ fontSize:"22px", fontWeight:"800", color:"#fff", marginTop:"2px" }}>₹ {totalOverdue.toLocaleString("en-IN")}</div>
              </div>
              <div style={{ fontSize:"2rem" }}>⚠️</div>
            </div>
          )}

          {/* Bills for selected date */}
          <div style={{
            background:"#fff", borderRadius:"20px",
            border:"1px solid #e5e7eb",
            boxShadow:"0 4px 20px rgba(0,0,0,0.06)",
            overflow:"hidden"
          }}>
            {/* Date header */}
            <div style={{
              padding:"18px 20px 16px",
              borderBottom:"1px solid #f1f5f9",
              display:"flex", alignItems:"center", justifyContent:"space-between"
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{
                  width:"36px", height:"36px", borderRadius:"10px",
                  background:"#eef2ff", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:"1rem"
                }}>📋</div>
                <div>
                  <div style={{ fontWeight:"800", fontSize:"13px", color:"#1e293b" }}>
                    {date.toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
                  </div>
                  <div style={{ fontSize:"11px", color:"#94a3b8", marginTop:"1px", fontWeight:"500" }}>
                    {selectedBills.length} bill{selectedBills.length !== 1 ? "s" : ""} due
                  </div>
                </div>
              </div>
              <div style={{
                background: selectedBills.length > 0 ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#f1f5f9",
                color: selectedBills.length > 0 ? "#fff" : "#94a3b8",
                fontSize:"11px", fontWeight:"800", padding:"4px 12px", borderRadius:"20px"
              }}>
                {selectedBills.length} bills
              </div>
            </div>

            {/* Bill list */}
            <div style={{ padding:"14px 16px" }}>
              {loading ? (
                <div style={{ textAlign:"center", padding:"28px 0", color:"#94a3b8", fontSize:"13px" }}>
                  Loading bills...
                </div>
              ) : selectedBills.length === 0 ? (
                <div style={{ textAlign:"center", padding:"28px 0" }}>
                  <div style={{ fontSize:"2.2rem", marginBottom:"8px" }}>🎉</div>
                  <div style={{ fontWeight:"700", color:"#374151", fontSize:"14px" }}>All clear!</div>
                  <div style={{ fontSize:"12px", color:"#94a3b8", marginTop:"4px" }}>No bills due on this date</div>
                </div>
              ) : (
                <>
                  <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                    {selectedBills.map((b, i) => {
                      const status = getStatus(b.dueDate);
                      const sc     = statusConfig[status];
                      const icon   = CATEGORY_ICONS[b.category] || CATEGORY_ICONS.default;
                      return (
                        <div key={b.id} className="bill-row fade-up" style={{
                          padding:"12px 14px", borderRadius:"13px",
                          background:sc.bg, border:`1px solid ${sc.border}`,
                          display:"flex", alignItems:"center", justifyContent:"space-between",
                          animationDelay:`${i * 0.06}s`, opacity:0
                        }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                            <div style={{
                              width:"34px", height:"34px", borderRadius:"9px",
                              background:sc.badgeBg, display:"flex",
                              alignItems:"center", justifyContent:"center", fontSize:"1rem"
                            }}>{icon}</div>
                            <div>
                              <div style={{ fontWeight:"700", fontSize:"13px", color:"#1e293b", textTransform:"capitalize" }}>{b.billName}</div>
                              <div style={{ fontSize:"10.5px", color:"#94a3b8", marginTop:"1px", fontWeight:"500" }}>
                                {b.category || "General"}
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontWeight:"800", fontSize:"13.5px", color:sc.badge }}>
                              ₹{Number(b.amount).toLocaleString("en-IN")}
                            </div>
                            <div style={{
                              fontSize:"10px", fontWeight:"700", color:sc.badge,
                              background:sc.badgeBg, borderRadius:"20px",
                              padding:"2px 8px", marginTop:"4px", display:"inline-block"
                            }}>{sc.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total row */}
                  <div style={{
                    marginTop:"14px", padding:"13px 16px", borderRadius:"13px",
                    background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
                    display:"flex", alignItems:"center", justifyContent:"space-between", color:"#fff"
                  }}>
                    <span style={{ fontWeight:"700", fontSize:"13px" }}>Total Due</span>
                    <span style={{ fontWeight:"800", fontSize:"16px" }}>₹ {totalDue.toLocaleString("en-IN")}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CalendarView;