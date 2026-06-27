import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getCurrentUser } from "../services/authApi";
import type { User } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.full_name}.</p>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </section>

      <section className="dashboard-card">
        <h2>Your Account</h2>

        <div className="account-details">
          <p>
            <strong>Name:</strong> {user?.full_name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Auth Provider:</strong> {user?.auth_provider}
          </p>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Generated Posts</h3>
          <p>Post history will appear here later.</p>
        </div>

        <div className="dashboard-card">
          <h3>Chrome Extension</h3>
          <p>Download and connect your extension here later.</p>
        </div>

        <div className="dashboard-card">
          <h3>Usage</h3>
          <p>Monthly AI generation usage will appear here later.</p>
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
