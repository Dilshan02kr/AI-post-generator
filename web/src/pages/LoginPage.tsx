import { Link } from "react-router";

function LoginPage() {
  return (
    <main className="page auth-page">
      <section className="auth-card">
        <h1>Login</h1>

        <p>Welcome back. Login to manage your generated LinkedIn posts.</p>

        <form className="auth-form">
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Enter your password" />
          </label>

          <button type="button" className="primary-button full-width">
            Login
          </button>

          <button type="button" className="google-button">
            Continue with Google
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
