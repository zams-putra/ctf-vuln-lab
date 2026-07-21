import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Secret from "./pages/Secret";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [userData, setUserData] = useState(undefined);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUserData(data))
      .catch(() => setUserData(null));
  }, []);

  if (userData === undefined) return (
    <div style={{
      minHeight: "100vh", background: "#060606",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Rajdhani', monospace", color: "#dc2626",
      letterSpacing: "0.3em", fontSize: 12,
    }}>
      <span style={{ animation: "pulse 1s ease-in-out infinite" }}>LOADING...</span>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"
          element={userData ? <Navigate to="/dashboard" /> : <Home setUserData={setUserData} />} />
        <Route path="/secret" element={<Secret />} />
        <Route path="/dashboard"
          element={userData
            ? <Dashboard userData={userData} setUserData={setUserData} />
            : <Navigate to="/" />} />
        <Route path="/profile/:id"
          element={userData ? <Profile userData={userData} /> : <Navigate to="/" />} />
        <Route path="/profile"
          element={userData ? <Navigate to={`/profile/${userData.id}`} /> : <Navigate to="/" />} />
        <Route path="/admin/ping"
          element={
            !userData
              ? <Navigate to="/" />
              : userData.role !== "admin"
              ? <Navigate to="/dashboard" />
              : <AdminPanel userData={userData} />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}