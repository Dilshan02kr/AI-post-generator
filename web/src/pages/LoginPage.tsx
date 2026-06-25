import { Link } from "react-router";

function LoginPage() {
  return (
    <main>
      <h1>Login</h1>

      <p>Login to manage your generated LinkedIn posts.</p>

      <form>
        <div>
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />
        </div>

        <div>
          <label>Password</label>
          <input type="password" placeholder="Enter password" />
        </div>

        <button type="button">Login</button>
        <button type="button">Continue with Google</button>
      </form>

      <p>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
}

export default LoginPage;
