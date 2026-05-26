import { useState, useEffect } from "react";
import { navigate } from "../router";
import { API } from "../api";
import Spinner from "../components/Spinner";

export default function CategoriesPage() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getCategories().then(setCats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-hero">
        <h1>Job Categories</h1>
        <p>Browse opportunities by industry</p>
      </div>
      <div className="section">
        <div className="section-in">
          {loading ? <Spinner /> : (
            <div className="cats-grid">
              {cats.map(c => (
                <button key={c.id} className="cat-card" onClick={() => navigate(`/jobs?categoryId=${c.id}`)}>
                  <span className="cat-icon">{c.icon || "📁"}</span>
                  <span className="cat-name">{c.name}</span>
                  <span className="cat-cnt">{c.jobCount} Jobs</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
