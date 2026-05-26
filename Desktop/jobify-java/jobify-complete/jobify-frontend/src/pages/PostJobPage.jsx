import { useState, useEffect } from "react";
import { navigate } from "../router";
import { useAuth } from "../AuthContext";
import { API } from "../api";

export default function PostJobPage() {
  const { user } = useAuth();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    title: "", description: "", requirements: "", responsibilities: "",
    location: "", jobType: "FULL_TIME", isRemote: false,
    salaryMin: "", salaryMax: "", experienceYears: "", deadline: "",
    categoryId: "", educationLevel: "",
  });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "EMPLOYER") { navigate("/dashboard"); return; }
    API.getCategories().then(setCats).catch(() => {});
  }, [user]);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  function addQuestion() { setQuestions(q => [...q, { question: "", isRequired: false, questionType: "TEXT" }]); }
  function removeQuestion(i) { setQuestions(q => q.filter((_, idx) => idx !== i)); }
  function setQ(i, k, v) { setQuestions(q => q.map((item, idx) => idx === i ? { ...item, [k]: v } : item)); }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await API.createJob({
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : null,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        salaryCurrency: "ETB",
        questions: questions.filter(q => q.question.trim()),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to post job. Please try again.");
    }
    setLoading(false);
  }

  if (success) return (
    <div className="dash-page">
      <div className="success-card">
        <span className="success-icon">🎉</span>
        <h2>Job Posted Successfully!</h2>
        <p>Your listing is now live and visible to candidates.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="browse-btn" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
          <button className="browse-btn" style={{ background: "transparent", border: "1.5px solid var(--blue)", color: "var(--blue)" }}
            onClick={() => { setSuccess(false); setForm({ title: "", description: "", requirements: "", responsibilities: "", location: "", jobType: "FULL_TIME", isRemote: false, salaryMin: "", salaryMax: "", experienceYears: "", deadline: "", categoryId: "", educationLevel: "" }); setQuestions([]); }}>
            Post Another
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dash-page">
      <div className="dash-in">
        <div className="dash-header">
          <div><h1>Post a New Job</h1><p>Fill in the details to attract the right candidates.</p></div>
        </div>
        {error && <div className="form-err" style={{ marginBottom: 16 }}>{error}</div>}
        <div className="dash-panel">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="span2">Job Title *<input value={form.title} onChange={set("title")} required placeholder="e.g. Senior Software Engineer" /></label>
              <label>Location<input value={form.location} onChange={set("location")} placeholder="Addis Ababa" /></label>
              <label>Job Type
                <select value={form.jobType} onChange={set("jobType")}>
                  {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"].map(t => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                </select>
              </label>
              <label>Category
                <select value={form.categoryId} onChange={set("categoryId")}>
                  <option value="">Select Category</option>
                  {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </label>
              <label>Education Level
                <select value={form.educationLevel} onChange={set("educationLevel")}>
                  <option value="">Any</option>
                  {["HIGH_SCHOOL", "DIPLOMA", "BACHELOR", "MASTER", "PHD"].map(e => <option key={e} value={e}>{e.replace("_", " ")}</option>)}
                </select>
              </label>
              <label>Experience (years)<input type="number" value={form.experienceYears} onChange={set("experienceYears")} placeholder="2" min="0" /></label>
              <label>Salary Min (ETB)<input type="number" value={form.salaryMin} onChange={set("salaryMin")} placeholder="50000" /></label>
              <label>Salary Max (ETB)<input type="number" value={form.salaryMax} onChange={set("salaryMax")} placeholder="100000" /></label>
              <label>Application Deadline<input type="date" value={form.deadline} onChange={set("deadline")} /></label>
              <label className="checkbox-label span2">
                <input type="checkbox" checked={form.isRemote} onChange={set("isRemote")} style={{ width: "auto" }} />
                <span>This job allows remote work</span>
              </label>
              <label className="span2">Job Description *<textarea rows={6} value={form.description} onChange={set("description")} required placeholder="Describe the role..." /></label>
              <label className="span2">Responsibilities<textarea rows={4} value={form.responsibilities} onChange={set("responsibilities")} placeholder="Key responsibilities..." /></label>
              <label className="span2">Requirements<textarea rows={4} value={form.requirements} onChange={set("requirements")} placeholder="Required qualifications..." /></label>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <strong style={{ fontSize: ".9rem", color: "var(--navy2)" }}>Screening Questions (optional)</strong>
                <button type="button" className="btn-sm" onClick={addQuestion}>+ Add Question</button>
              </div>
              {questions.map((q, i) => (
                <div key={i} className="q-row">
                  <input value={q.question} onChange={e => setQ(i, "question", e.target.value)} placeholder={`Question ${i + 1}...`} />
                  <select style={{ width: 130 }} value={q.questionType} onChange={e => setQ(i, "questionType", e.target.value)}>
                    <option value="TEXT">Text</option>
                    <option value="YES_NO">Yes/No</option>
                  </select>
                  <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: ".8rem", whiteSpace: "nowrap" }}>
                    <input type="checkbox" checked={q.isRequired} onChange={e => setQ(i, "isRequired", e.target.checked)} style={{ width: "auto" }} /> Required
                  </label>
                  <button type="button" className="q-remove" onClick={() => removeQuestion(i)}>✕</button>
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading} className="auth-btn-full">
              {loading ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
