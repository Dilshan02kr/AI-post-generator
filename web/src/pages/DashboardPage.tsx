import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getCurrentUser } from "../services/authApi";
import type { User } from "../services/authApi";

function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCurrentUser() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Session expired. Please login again.");
        }

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurrentUser();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <p className="error-message">{error}</p>
      </main>
    );
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
