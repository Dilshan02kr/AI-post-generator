import { Link, Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import DownloadExtensionPage from "./pages/DownloadExtensionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">AI Post Generator</Link>

        <div>
          <Link to="/download">Download Extension</Link>{" "}
          <Link to="/login">Login</Link> <Link to="/register">Register</Link>{" "}
          <Link to="/dashboard">Dashboard</Link>
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
