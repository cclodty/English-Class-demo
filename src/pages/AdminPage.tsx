import React, { useState } from "react";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("adminAuth") === "true"
  );

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
