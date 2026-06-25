import { Link } from "react-router";

function LandingPage() {
  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="badge">AI-powered Chrome Extension</p>

          <h1>Turn any article into a professional LinkedIn post.</h1>

          <p className="hero-text">
            AI Post Generator helps you extract article content, generate
            LinkedIn-ready posts, save post history, and publish faster.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="primary-button">
              Start Free
            </Link>

            <Link to="/download" className="secondary-button">
              Download Extension
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>How it works</h3>

          <ol>
            <li>Open an article in your browser</li>
            <li>Use the Chrome extension to extract content</li>
            <li>Generate a LinkedIn-ready post using AI</li>
            <li>Copy, export, or save it to your account</li>
          </ol>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
