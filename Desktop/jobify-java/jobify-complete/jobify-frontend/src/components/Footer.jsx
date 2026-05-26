import { Link } from "../router";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-in">
        <div>
          <div className="footer-logo">Job<span>ify</span></div>
          <p className="footer-desc">
            A modern job marketplace connecting great people with great teams across Ethiopia and beyond.
          </p>
        </div>
        <div className="footer-col">
          <h4>Job Seekers</h4>
          <Link to="/jobs" className="footer-link">Browse Jobs</Link>
          <Link to="/register" className="footer-link">Create Account</Link>
          <Link to="/dashboard" className="footer-link">My Applications</Link>
        </div>
        <div className="footer-col">
          <h4>Employers</h4>
          <Link to="/register?role=EMPLOYER" className="footer-link">Post a Job</Link>
          <Link to="/companies" className="footer-link">Company Profiles</Link>
          <Link to="/dashboard" className="footer-link">Employer Dashboard</Link>
        </div>
        <div className="footer-col">
          <h4>Categories</h4>
          <Link to="/categories" className="footer-link">IT & Technology</Link>
          <Link to="/categories" className="footer-link">Finance</Link>
          <Link to="/categories" className="footer-link">NGO & Development</Link>
          <Link to="/categories" className="footer-link">Health</Link>
        </div>
      </div>
      <div className="footer-btm">
        <span className="footer-copy">© {new Date().getFullYear()} Jobify. All rights reserved.</span>
        <div className="footer-legal">
          <a href="#/privacy">Privacy Policy</a>
          <a href="#/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
