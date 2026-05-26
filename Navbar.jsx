import { useAuth } from "../AuthContext";
import { Link, navigate } from "../router";

export default function Navbar({ path }) {
  const { user, logout } = useAuth();
  const isActive = (p) => path.startsWith(p) ? "nav-link active" : "nav-link";

  return (
    <nav className="nav">
      <div className="nav-in">
        <Link to="/" className="nav-logo">
          <span>💼</span>Job<span className="nav-logo-accent">ify</span>
        </Link>
        <div className="nav-links">
          <Link to="/jobs" className={isActive("/jobs")}>Find Jobs</Link>
          <Link to="/companies" className={isActive("/companies")}>Companies</Link>
          <Link to="/categories" className={isActive("/categories")}>Categories</Link>
        </div>
        <div className="nav-auth">
          {user ? (
            <div className="nav-user">
              <span className="nav-name">{user.fullName?.split(" ")[0]}</span>
              {user.role === "EMPLOYER" && (
                <Link to="/post-job" className="btn-post">Post Job</Link>
              )}
              <Link to="/dashboard" className="btn-outline-sm">Dashboard</Link>
              <button className="btn-ghost" onClick={() => { logout(); navigate("/"); }}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
