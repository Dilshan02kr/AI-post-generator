import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(Boolean(token));
  }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
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
