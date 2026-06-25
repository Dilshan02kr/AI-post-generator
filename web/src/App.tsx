import { Link, Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DownloadExtensionPage from "./pages/DownloadExtensionPage";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">
          AI Post Generator
        </Link>

        <div className="nav-links">
          <Link to="/download">Download Extension</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-button">
            Get Started
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/download" element={<DownloadExtensionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
