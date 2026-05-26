import { useState, useEffect } from "react";
import { navigate } from "../router";
import { API } from "../api";
import Spinner from "../components/Spinner";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getCompanies().then(setCompanies).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-hero">
        <h1>Companies</h1>
        <p>Discover top employers hiring on Jobify</p>
      </div>
      <div className="section">
        <div className="section-in">
          {loading ? <Spinner /> : (
            <div className="company-grid">
              {companies.map(c => (
                <div key={c.id} className="company-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                    <div className="co-avatar">
                      {c.logoUrl ? <img src={c.logoUrl} alt={c.companyName} /> : c.companyName?.[0]}
                    </div>
                    <div>
                      <div className="co-name">{c.companyName}</div>
                      {c.isVerified && <span className="verified-badge">✓ Verified</span>}
                    </div>
                  </div>
                  {c.industry && <div className="co-detail">🏭 {c.industry}</div>}
                  {c.location && <div className="co-detail">📍 {c.location}</div>}
                  {c.description && (
                    <div className="co-desc">
                      {c.description.slice(0, 120)}{c.description.length > 120 ? "..." : ""}
                    </div>
                  )}
                  <button className="browse-btn" style={{ marginTop: 12, fontSize: ".8rem", padding: "8px 16px" }}
                    onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(c.companyName)}`)}>
                    View Jobs
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
