import { useState, useEffect } from "react";
import { navigate } from "../router";
import { useAuth } from "../AuthContext";
import { API } from "../api";
import Spinner from "../components/Spinner";

function Logo({ url, name, size }) {
  if (url) return <img src={url} alt={name} style={{ width: size, height: size, objectFit: "cover" }} />;
  return <span style={{ fontSize: size * 0.4 }}>{name?.[0] ?? "?"}</span>;
}

export default function JobDetailPage({ id }) {
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [answers, setAnswers] = useState({});
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.getJob(id),
      API.getJobQuestions(id).catch(() => []),
      user ? API.checkApplied(id).catch(() => ({ applied: false })) : Promise.resolve({ applied: false }),
    ]).then(([j, qs, chk]) => {
      setJob(j);
      setQuestions(qs || []);
      setApplied(chk?.applied || false);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, user]);

  async function handleApply() {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "JOB_SEEKER") { setError("Only job seekers can apply."); return; }
    setApplying(true); setError("");
    try {
      const answerList = questions.map(q => ({ questionId: q.id, answer: answers[q.id] || "" }));
      await API.apply({ jobId: Number(id), coverLetter, answers: answerList });
      setApplied(true); setShowForm(false);
    } catch (e) { setError(e.message || "Application failed."); }
    setApplying(false);
  }

  if (loading) return <Spinner />;
  if (!job) return (
    <div className="jd-page">
      <div className="empty-state" style={{ marginTop: 40 }}>
        <span className="es-icon">❌</span><h3>Job not found</h3>
      </div>
    </div>
  );

  return (
    <div className="jd-page">
      <button className="back-btn" onClick={() => navigate("/jobs")}>← Back to Jobs</button>
      <div className="jd-card">
        <div className="jd-banner">
          <div className="jd-logo"><Logo url={job.companyLogo} name={job.companyName} size={64} /></div>
          <div className="jd-title-block">
            <h1>{job.title}</h1>
            <div className="jd-co">{job.companyName}</div>
            <div className="jd-meta-tags">
              {job.location && <span className="jd-tag">📍 {job.location}</span>}
              {job.isRemote && <span className="jd-tag remote">🌐 Remote</span>}
              <span className="jd-tag">{job.jobType?.replace("_", " ")}</span>
              {job.categoryName && <span className="jd-tag">🏷️ {job.categoryName}</span>}
            </div>
          </div>
          <div>
            {applied
              ? <div className="applied-badge">✅ Applied!</div>
              : <button className="apply-btn" onClick={() => { if (!user) navigate("/login"); else setShowForm(s => !s); }}>Apply Now</button>
            }
            <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.4)", marginTop: 8, textAlign: "right" }}>
              👁️ {job.views} views
            </div>
          </div>
        </div>

        <div className="jd-body">
          <div className="jd-info-grid">
            {job.salaryMin && <div className="info-chip"><strong>💰 Salary</strong><span>{job.salaryCurrency} {Number(job.salaryMin).toLocaleString()} – {Number(job.salaryMax).toLocaleString()}</span></div>}
            {job.experienceYears != null && <div className="info-chip"><strong>⏱️ Experience</strong><span>{job.experienceYears}+ years</span></div>}
            {job.deadline && <div className="info-chip"><strong>📅 Deadline</strong><span>{new Date(job.deadline).toLocaleDateString()}</span></div>}
            {job.educationLevel && <div className="info-chip"><strong>🎓 Education</strong><span>{job.educationLevel.replace("_", " ")}</span></div>}
          </div>

          {showForm && !applied && (
            <div className="apply-form-card">
              <h3>Submit Application</h3>
              {error && <div className="form-err">{error}</div>}
              <textarea rows={5} placeholder="Cover letter (optional)..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} style={{ marginBottom: 14 }} />
              {questions.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <strong style={{ fontSize: ".85rem", color: "var(--navy2)", display: "block", marginBottom: 10 }}>Screening Questions</strong>
                  {questions.map(q => (
                    <label key={q.id} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12, fontSize: ".83rem", fontWeight: 700, color: "var(--navy2)" }}>
                      {q.question}{q.isRequired && <span style={{ color: "var(--red)" }}> *</span>}
                      {q.questionType === "YES_NO"
                        ? <select value={answers[q.id] || ""} onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></select>
                        : <input value={answers[q.id] || ""} onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))} placeholder="Your answer..." />
                      }
                    </label>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <button className="apply-btn" onClick={handleApply} disabled={applying}>{applying ? "Submitting..." : "Submit Application"}</button>
                <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {job.description && <div className="jd-section"><h2>Job Description</h2><div className="jd-prose">{job.description}</div></div>}
          {job.responsibilities && <div className="jd-section"><h2>Responsibilities</h2><div className="jd-prose">{job.responsibilities}</div></div>}
          {job.requirements && <div className="jd-section"><h2>Requirements</h2><div className="jd-prose">{job.requirements}</div></div>}
        </div>
      </div>
    </div>
  );
}
