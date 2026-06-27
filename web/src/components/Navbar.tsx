import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { isLoggedIn, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        AI Post Generator
      </Link>

      <div className="nav-links">
        <Link to="/download">Download Extension</Link>

        {isLoggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>

            <button onClick={handleLogout} className="nav-logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register" className="nav-button">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
