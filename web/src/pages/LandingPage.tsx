import { Link } from "react-router";

function LandingPage() {
  return (
    <main>
      <h1>AI Post Generator</h1>

      <p>Turn any article into a professional LinkedIn post using AI.</p>

      <Link to="/register">
        <button type="button">Get Started</button>
      </Link>

      <Link to="/download">
        <button type="button">Download Extension</button>
      </Link>
    </main>
  );
}

export default LandingPage;
