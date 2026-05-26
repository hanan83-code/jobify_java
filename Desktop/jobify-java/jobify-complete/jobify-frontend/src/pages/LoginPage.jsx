import { useState } from "react";
import { Link, navigate } from "../router";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">💼 Jobify</div>
        <h2>Welcome back</h2>
        <p className="auth-sub">Sign in to your account</p>
        {error && <div className="auth-err">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email Address
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </label>
          <button type="submit" disabled={loading} className="auth-btn-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: ".73rem", color: "var(--gray300)", background: "var(--gray50)", borderRadius: "var(--r-sm)", padding: "10px 14px" }}>
          <strong>Demo Accounts</strong><br />
          seeker@jobify.dev · employer@jobify.dev<br />
          Password: <strong>Password123!</strong>
        </div>
      </div>
    </div>
  );
}
