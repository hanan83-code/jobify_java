import { useState } from "react";
import { Link, navigate } from "../router";
import { useAuth } from "../AuthContext";

export default function RegisterPage({ searchStr }) {
  const { register } = useAuth();
  const params = new URLSearchParams(searchStr);
  const initRole = params.get("role")?.toUpperCase() === "EMPLOYER" ? "EMPLOYER" : "JOB_SEEKER";
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", role: initRole, companyName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">💼 Jobify</div>
        <h2>Create an account</h2>
        <p className="auth-sub">Find your next opportunity</p>
        {error && <div className="auth-err">{error}</div>}
        <div className="role-toggle">
          {[["JOB_SEEKER", "👤 Job Seeker"], ["EMPLOYER", "🏢 Employer"]].map(([r, label]) => (
            <button key={r} type="button" className={`role-btn${form.role === r ? " active" : ""}`}
              onClick={() => setForm(f => ({ ...f, role: r }))}>
              {label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Full Name<input value={form.fullName} onChange={set("fullName")} required placeholder="Abebe Kebede" /></label>
          <label>Email Address<input type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" /></label>
          <label>Password<input type="password" value={form.password} onChange={set("password")} required placeholder="Min. 6 characters" minLength={6} /></label>
          <label>Phone (optional)<input value={form.phone} onChange={set("phone")} placeholder="+251 9..." /></label>
          {form.role === "EMPLOYER" && (
            <label>Company Name<input value={form.companyName} onChange={set("companyName")} required placeholder="TechCorp Ethiopia" /></label>
          )}
          <button type="submit" disabled={loading} className="auth-btn-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
