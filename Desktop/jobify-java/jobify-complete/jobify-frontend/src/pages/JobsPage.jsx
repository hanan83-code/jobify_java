import { useState, useEffect, useCallback } from "react";
import { API } from "../api";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";

export default function JobsPage({ searchStr }) {
  const params = new URLSearchParams(searchStr);
  const [keyword, setKeyword] = useState(params.get("keyword") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");
  const [categoryId, setCategoryId] = useState(params.get("categoryId") ?? "");
  const [jobType, setJobType] = useState("");
  const [page, setPage] = useState(0);
  const [result, setResult] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { API.getCategories().then(setCats).catch(() => {}); }, []);

  const load = useCallback(() => {
    setLoading(true);
    const p = { page, size: 12 };
    if (keyword) p.keyword = keyword;
    if (location) p.location = location;
    if (categoryId) p.categoryId = categoryId;
    if (jobType) p.jobType = jobType;
    API.getJobs(p)
      .then(r => { setResult(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, [keyword, location, categoryId, jobType, page]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e) { e.preventDefault(); setPage(0); }

  return (
    <div>
      <div className="jobs-topbar">
        <div className="jobs-topbar-in">
          <form className="jobs-search-bar" onSubmit={handleSearch}>
            <input style={{ flex: 2 }} value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="🔍 Job title or keyword" />
            <input style={{ flex: 1 }} value={location} onChange={e => setLocation(e.target.value)} placeholder="📍 Location" />
            <select style={{ flex: 1 }} value={jobType} onChange={e => setJobType(e.target.value)}>
              <option value="">All Types</option>
              {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"].map(t => (
                <option key={t} value={t}>{t.replace("_", " ")}</option>
              ))}
            </select>
            <button type="submit" className="search-submit" style={{ padding: "10px 24px" }}>Search</button>
          </form>
        </div>
      </div>

      <div className="jobs-layout">
        <aside className="jobs-sidebar">
          <div className="sidebar-box">
            <h3>Category</h3>
            <label className="sidebar-item">
              <input type="radio" name="cat" checked={categoryId === ""} onChange={() => { setCategoryId(""); setPage(0); }} />
              <span>All Categories</span>
            </label>
            {cats.map(c => (
              <label key={c.id} className="sidebar-item">
                <input type="radio" name="cat" checked={categoryId === String(c.id)} onChange={() => { setCategoryId(String(c.id)); setPage(0); }} />
                <span>{c.icon} {c.name}</span>
                <span className="sidebar-cnt">{c.jobCount}</span>
              </label>
            ))}
          </div>
        </aside>

        <main className="jobs-main">
          <div className="jobs-hdr">
            <span className="jobs-count">{result.totalElements.toLocaleString()} jobs found</span>
          </div>
          {loading ? <Spinner /> : result.content.length === 0 ? (
            <div className="empty-state">
              <span className="es-icon">🔍</span>
              <h3>No jobs found</h3>
              <p>Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="jobs-list">
              {result.content.map(job => <JobCard key={job.id} job={job} variant="row" />)}
            </div>
          )}
          {result.totalPages > 1 && (
            <div className="pagination">
              <button className="pg-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
              {[...Array(Math.min(result.totalPages, 7))].map((_, i) => (
                <button key={i} className={`pg-btn${page === i ? " active" : ""}`} onClick={() => setPage(i)}>{i + 1}</button>
              ))}
              <button className="pg-btn" disabled={page >= result.totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
