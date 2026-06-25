import { Link } from "react-router";

function RegisterPage() {
  return (
    <main className="page auth-page">
      <section className="auth-card">
        <h1>Create account</h1>

        <p>Start generating professional LinkedIn posts from articles.</p>

        <form className="auth-form">
          <label>
            Full name
            <input type="text" placeholder="Your name" />
          </label>

          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Create a password" />
          </label>

          <button type="button" className="primary-button full-width">
            Register
          </button>

          <button type="button" className="google-button">
            Continue with Google
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;