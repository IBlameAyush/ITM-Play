
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/7166/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (onLoginSuccess) {
      await onLoginSuccess();
      }

      navigate("/movies");
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Sign in to itmPlay</h1>
        <p className="auth-subtitle">
          Continue discovering your next favourite movie.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          New to itmPlay? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
