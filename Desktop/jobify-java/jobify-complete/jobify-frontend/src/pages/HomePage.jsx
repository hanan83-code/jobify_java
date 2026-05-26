import { useState, useEffect } from "react";
import { navigate } from "../router";
import { API } from "../api";
import JobCard from "../components/JobCard";

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [cats, setCats] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    API.getCategories().then(setCats).catch(() => {});
    API.getJobs({ size: 6 }).then(r => setFeaturedJobs(r.content || [])).catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (keyword) q.set("keyword", keyword);
    if (location) q.set("location", location);
    navigate(`/jobs?${q}`);
  }

  return (
    <div>
      <section className="hero">
        <div className="hero-glow" /><div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-badge">✦ Ethiopia's #1 Job Platform</div>
          <h1>Find your next role <span className="hero-serif">faster</span></h1>
          <p>Search verified jobs from real companies, track applications, and apply in minutes.</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <div className="sf">
              <span className="sf-icon">🔍</span>
              <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Job title, keywords, company..." />
            </div>
            <div className="sf-div" />
            <div className="sf">
              <span className="sf-icon">📍</span>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, region..." />
            </div>
            <button type="submit" className="search-submit">Search Jobs</button>
          </form>
          <div className="hero-tags">
            <span className="hero-tags-label">Popular:</span>
            {["Software Engineer", "Accountant", "Project Manager", "Nurse", "Driver"].map(t => (
              <button key={t} className="hero-tag" onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(t)}`)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-bar">
        {[["12,000+", "Active Jobs"], ["4,500+", "Companies"], ["180,000+", "Job Seekers"], ["98%", "Satisfaction"]].map(([v, l]) => (
          <div key={l} className="stat-item">
            <span className="stat-val">{v}</span>
            <span className="stat-lbl">{l}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-in">
          <div className="section-hdr">
            <div><h2>Browse by <span>Category</span></h2><p>Explore opportunities across all industries</p></div>
            <button className="view-all-btn" onClick={() => navigate("/categories")}>View All →</button>
          </div>
          <div className="cats-grid">
            {cats.slice(0, 12).map(c => (
              <button key={c.id} className="cat-card" onClick={() => navigate(`/jobs?categoryId=${c.id}`)}>
                <span className="cat-icon">{c.icon || "📁"}</span>
                <span className="cat-name">{c.name}</span>
                <span className="cat-cnt">{c.jobCount} Jobs</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-in">
          <div className="section-hdr">
            <h2>Featured <span>Jobs</span></h2>
            <button className="view-all-btn" onClick={() => navigate("/jobs")}>View All Jobs →</button>
          </div>
          <div className="jobs-grid">
            {featuredJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </section>

      <section className="cta-sec">
        <div className="cta-in">
          <div className="cta-text">
            <h2>Hiring great people?</h2>
            <p>Post your job and reach thousands of qualified candidates across Ethiopia.</p>
          </div>
          <div className="cta-actions">
            <button className="cta-btn" onClick={() => navigate("/register?role=EMPLOYER")}>Post a Job Free</button>
            <button className="cta-btn-outline" onClick={() => navigate("/companies")}>Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
}
