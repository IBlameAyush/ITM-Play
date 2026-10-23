
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register({ onRegisterSuccess }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/7166/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }
      await onRegisterSuccess();
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
        <p className="eyebrow">JOIN ITMPLAY</p>
        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Create your personal space for discovering movies.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="register-name">Full name</label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            maxLength={60}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
