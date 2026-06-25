import { Link } from "react-router";

function RegisterPage() {
  return (
    <main>
      <h1>Create Account</h1>

      <p>Create an account to start using AI Post Generator.</p>

      <form>
        <div>
          <label>Full name</label>
          <input type="text" placeholder="Your name" />
        </div>

        <div>
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />
        </div>

        <div>
          <label>Password</label>
          <input type="password" placeholder="Create password" />
        </div>

        <button type="button">Register</button>
        <button type="button">Continue with Google</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  );
}

export default RegisterPage;
