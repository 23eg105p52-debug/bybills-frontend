import { HashRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Bills from "./pages/Bills";
import AddBill from "./pages/AddBill";
import Status from "./pages/Status";
import CalendarView from "./pages/CalendarView";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function PageTitle() {
  const location = useLocation();
  const titles = {
    "/": "Dashboard",
    "/bills": "Bills",
    "/add": "Add Bill",
    "/status": "Status",
    "/calendar": "Calendar",
  };
  return (
    <>
      <h2>{titles[location.pathname] || "BYBills"}</h2>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");

  if (!user) {
    return page === "login" ? (
      <Login onLogin={(name) => setUser(name)} goToSignup={() => setPage("signup")} />
    ) : (
      <Signup goToLogin={() => setPage("login")} />
    );
  }

  return (
    <Router>
      <div className="layout">
        <div className="sidebar">
          <h2 className="logo">BYBills</h2>
          <Link to="/">🏠 Dashboard</Link>
          <Link to="/bills">💵 Bills</Link>
          <Link to="/add">➕ Add Bill</Link>
          <Link to="/status">⚠ Status</Link>
          <Link to="/calendar">📅 Calendar</Link>
        </div>
        <div className="main">
          <div className="header">
            <PageTitle />
            <button onClick={() => setUser(null)}>Logout</button>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/add" element={<AddBill />} />
            <Route path="/status" element={<Status />} />
            <Route path="/calendar" element={<CalendarView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
