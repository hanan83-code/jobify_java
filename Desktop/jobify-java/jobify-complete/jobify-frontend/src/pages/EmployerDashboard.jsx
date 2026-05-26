import { useState, useEffect } from "react";
import { navigate } from "../router";
import { useAuth } from "../AuthContext";
import { API } from "../api";
import Spinner from "../components/Spinner";

const STATUS_COLOR = { PENDING: "#f59e0b", REVIEWED: "#3b82f6", SHORTLISTED: "#8b5cf6", REJECTED: "#ef4444", HIRED: "#10b981" };

export default function EmployerDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("jobs");
  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [companyForm, setCompanyForm] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  // messaging
  const [activeConv, setActiveConv] = useState(null); // { seekerId, seekerName, appId }
  const [thread, setThread] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.getEmployerStats().catch(() => ({})),
      API.getEmployerJobs().catch(() => ({ content: [] })),
      API.getMyCompany().catch(() => null),
    ]).then(([s, j, c]) => {
      setStats(s);
      setJobs(j.content || []);
      setCompany(c);
      setCompanyForm(c ? { ...c } : {});
      setLoading(false);
    });
  }, []);

  async function loadApplicants(job) {
    setSelectedJob(job);
    setTab("applicants");
    const res = await API.getJobApplications(job.id).catch(() => ({ content: [] }));
    setApplicants(res.content || []);
  }

  async function updateStatus(appId, status) {
    try {
      await API.updateAppStatus(appId, status);
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
      setMsg("Status updated."); setMsgType("success");
    } catch (err) { setMsg("Update failed: " + err.message); setMsgType("error"); }
  }

  async function saveCompany(e) {
    e.preventDefault(); setSaving(true); setMsg("");
    try {
      const updated = await API.updateMyCompany(companyForm);
      setCompany(updated);
      setMsg("Company profile saved!"); setMsgType("success");
    } catch (err) { setMsg("Save failed: " + err.message); setMsgType("error"); }
    setSaving(false);
  }

  async function uploadLogo(e) {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const res = await API.uploadLogo(file);
      setCompany(c => ({ ...c, logoUrl: res.logoUrl }));
      setMsg("Logo uploaded!"); setMsgType("success");
    } catch (err) { setMsg("Upload failed: " + err.message); setMsgType("error"); }
  }

  async function openConversation(seekerId, seekerName, appId) {
    setActiveConv({ seekerId, seekerName, appId });
    const msgs = await API.getApplicationThread(appId).catch(() => []);
    setThread(msgs);
  }

  async function doSendMessage() {
    if (!newMsg.trim() || !activeConv) return;
    try {
      await API.sendMessage({ recipientId: activeConv.seekerId, applicationId: activeConv.appId, content: newMsg });
      setNewMsg("");
      const msgs = await API.getApplicationThread(activeConv.appId).catch(() => []);
      setThread(msgs);
    } catch (err) { setMsg("Send failed: " + err.message); setMsgType("error"); }
  }

  async function toggleJobStatus(jobId, currentStatus) {
    const newStatus = currentStatus === "ACTIVE" ? "CLOSED" : "ACTIVE";
    try {
      await API.updateJobStatus(jobId, newStatus);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch (err) { setMsg("Update failed: " + err.message); setMsgType("error"); }
  }

  if (loading) return <Spinner />;

  const setC = k => e => setCompanyForm(f => ({ ...f, [k]: e.target.value }));
  const cf = companyForm;

  return (
    <div className="dash-page">
      <div className="dash-in" style={{ maxWidth: 1200 }}>
        <div className="dash-header">
          <div>
            <h1>Employer Dashboard</h1>
            <p>{stats.companyName ? `Managing ${stats.companyName}` : "Manage your jobs and applicants."}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="browse-btn" onClick={() => navigate("/post-job")}>+ Post Job</button>
            <button className="dash-logout" onClick={() => { logout(); navigate("/"); }}>Logout</button>
          </div>
        </div>

        <div className="dash-stats">
          <div className="ds-card"><strong>{stats.jobs ?? 0}</strong><span>Total Jobs</span></div>
          <div className="ds-card"><strong>{stats.activeJobs ?? 0}</strong><span>Active Jobs</span></div>
          <div className="ds-card"><strong>{stats.applications ?? 0}</strong><span>Total Applications</span></div>
        </div>

        <div className="dash-tabs">
          {[["jobs", "💼 My Jobs"], ["applicants", "👥 Applicants"], ["company", "🏢 Company Profile"], ["messages", "💬 Messages"]].map(([id, label]) => (
            <button key={id} className={`dash-tab${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {msg && (
          <div className={msgType === "success" ? "success-msg" : msgType === "error" ? "form-err" : "info-msg"} style={{ marginBottom: 16 }}>
            {msg}
          </div>
        )}

        {/* ── MY JOBS TAB ── */}
        {tab === "jobs" && (
          <div className="dash-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>My Job Listings</h2>
              <button className="browse-btn" onClick={() => navigate("/post-job")}>+ Post New Job</button>
            </div>
            {jobs.length === 0 ? (
              <div className="dash-empty">
                <p style={{ color: "var(--gray500)", marginBottom: 16 }}>No jobs posted yet.</p>
                <button className="browse-btn" onClick={() => navigate("/post-job")}>Post Your First Job</button>
              </div>
            ) : (
              <div className="app-list">
                {jobs.map(job => (
                  <div key={job.id} className="app-item" style={{ flexWrap: "wrap", gap: 12 }}>
                    <div className="app-info" style={{ flex: 1 }}>
                      <strong>{job.title}</strong>
                      <span>{job.location ?? "—"} · {job.applicationCount} applicants · {job.views} views</span>
                      <small style={{ color: STATUS_COLOR[job.status] || "var(--gray500)" }}>{job.status}</small>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button className="btn-sm" onClick={() => loadApplicants(job)}>View Applicants</button>
                      <button className="btn-sm" style={{ background: job.status === "ACTIVE" ? "var(--gray500)" : "var(--green)" }}
                        onClick={() => toggleJobStatus(job.id, job.status)}>
                        {job.status === "ACTIVE" ? "Close" : "Reopen"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── APPLICANTS TAB ── */}
        {tab === "applicants" && (
          <div className="dash-panel">
            <h2>{selectedJob ? `Applicants: ${selectedJob.title}` : "Select a job from My Jobs"}</h2>
            {!selectedJob ? (
              <p style={{ color: "var(--gray500)" }}>Go to My Jobs and click "View Applicants".</p>
            ) : applicants.length === 0 ? (
              <p style={{ color: "var(--gray500)" }}>No applications yet for this job.</p>
            ) : (
              <div className="app-list">
                {applicants.map(app => (
                  <div key={app.id} className="app-item" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div className="app-info" style={{ flex: 1 }}>
                      <strong>{app.seeker?.fullName}</strong>
                      <span>{app.seeker?.email}</span>
                      {app.seeker?.phone && <small>{app.seeker.phone}</small>}
                      {app.coverLetter && (
                        <p style={{ fontSize: ".82rem", color: "var(--gray500)", marginTop: 6, lineHeight: 1.5 }}>
                          {app.coverLetter}
                        </p>
                      )}
                      {app.cvUrl && (
                        <a href={app.cvUrl} target="_blank" rel="noreferrer" style={{ fontSize: ".8rem", color: "var(--blue)", fontWeight: 700 }}>
                          📄 Download CV
                        </a>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <select className="status-sel" value={app.status} onChange={e => updateStatus(app.id, e.target.value)}>
                        {["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED", "HIRED"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button className="btn-sm" onClick={() => { setTab("messages"); openConversation(app.seeker?.id, app.seeker?.fullName, app.id); }}>
                        💬 Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── COMPANY PROFILE TAB ── */}
        {tab === "company" && (
          <form onSubmit={saveCompany}>
            <div className="profile-section">
              <h3>Company Branding</h3>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ width: 80, height: 80, borderRadius: "var(--r-md)", background: "var(--navy3)", display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0 }}>
                  {company?.logoUrl
                    ? <img src={company.logoUrl} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ color: "var(--white)", fontSize: "1.5rem" }}>{company?.companyName?.[0] ?? "?"}</span>}
                </div>
                <label className="upload-area" style={{ flex: 1 }}>
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: "none" }} onChange={uploadLogo} />
                  <div>📤 Upload company logo (JPG, PNG — max 5MB)</div>
                </label>
              </div>
              <div className="form-grid">
                <label>Company Name *<input value={cf.companyName || ""} onChange={setC("companyName")} required /></label>
                <label>Industry<input value={cf.industry || ""} onChange={setC("industry")} placeholder="Information Technology" /></label>
                <label>Location<input value={cf.location || ""} onChange={setC("location")} placeholder="Addis Ababa" /></label>
                <label>Website<input value={cf.website || ""} onChange={setC("website")} placeholder="https://company.com" /></label>
                <label>Company Size
                  <select value={cf.size || ""} onChange={setC("size")}>
                    <option value="">Select size</option>
                    {[["S_1_10", "1–10"], ["S_11_50", "11–50"], ["S_51_200", "51–200"], ["S_201_500", "201–500"], ["S_500_PLUS", "500+"]].map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </label>
                <label>Founded Year<input type="number" value={cf.foundedYear || ""} onChange={setC("foundedYear")} placeholder="2010" min="1900" max={new Date().getFullYear()} /></label>
                <label className="span2">Company Description
                  <textarea rows={5} value={cf.description || ""} onChange={setC("description")} placeholder="Tell candidates about your company, culture, and mission..." />
                </label>
              </div>
            </div>
            <button type="submit" disabled={saving} className="auth-btn-full" style={{ maxWidth: 300 }}>
              {saving ? "Saving..." : "Save Company Profile"}
            </button>
          </form>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === "messages" && (
          <div className="dash-panel">
            <h2>Applicant Messages</h2>
            {!activeConv ? (
              <p style={{ color: "var(--gray500)" }}>Go to Applicants and click 💬 to start a conversation.</p>
            ) : (
              <>
                <div style={{ marginBottom: 10, fontWeight: 700, color: "var(--navy2)" }}>
                  Conversation with {activeConv.seekerName}
                </div>
                <div className="msg-thread">
                  {thread.map(m => (
                    <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: m.senderId === user.id ? "flex-end" : "flex-start" }}>
                      <div className={`msg-bubble ${m.senderId === user.id ? "mine" : "theirs"}`}>
                        {m.content}
                        <div className="msg-time">{new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                  ))}
                  {thread.length === 0 && <p style={{ color: "var(--gray500)", fontSize: ".85rem" }}>No messages yet. Start the conversation!</p>}
                </div>
                <div className="msg-input-row">
                  <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message..." onKeyDown={e => e.key === "Enter" && doSendMessage()} />
                  <button className="msg-send-btn" onClick={doSendMessage}>Send</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
