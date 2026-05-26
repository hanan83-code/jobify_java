import { useState, useEffect } from "react";
import { navigate } from "../router";
import { useAuth } from "../AuthContext";
import { API } from "../api";
import Spinner from "../components/Spinner";

const STATUS_COLOR = { PENDING: "#f59e0b", REVIEWED: "#3b82f6", SHORTLISTED: "#8b5cf6", REJECTED: "#ef4444", HIRED: "#10b981" };

export default function SeekerDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("applications");
  const [apps, setApps] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  // messaging
  const [inbox, setInbox] = useState([]);
  const [activeConv, setActiveConv] = useState(null); // { otherUserId, otherName, appId }
  const [thread, setThread] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.getMyApplications(user.id).catch(() => ({ content: [] })),
      API.getSeekerProfile().catch(() => null),
      API.getInbox().catch(() => ({ content: [] })),
    ]).then(([a, p, i]) => {
      setApps(a.content || []);
      setProfile(p);
      setProfileForm(p ? { ...p } : { fullName: user.fullName, phone: user.phone || "" });
      setInbox(i.content || []);
      setLoading(false);
    });
  }, [user.id, user.fullName, user.phone]);

  async function saveProfile(e) {
    e.preventDefault(); setSaving(true); setMsg("");
    try {
      const updated = await API.updateSeekerProfile(profileForm);
      setProfile(updated);
      setMsg("Profile saved successfully!"); setMsgType("success");
    } catch (err) { setMsg("Save failed: " + err.message); setMsgType("error"); }
    setSaving(false);
  }

  async function uploadCv(e) {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const res = await API.uploadCv(file);
      setProfile(p => ({ ...p, cvUrl: res.cvUrl, cvFilename: res.cvFilename }));
      setMsg("CV uploaded!"); setMsgType("success");
    } catch (err) { setMsg("Upload failed: " + err.message); setMsgType("error"); }
  }

  async function openConversation(otherUserId, otherName, appId) {
    if (!otherUserId) return; // guard against null
    setActiveConv({ otherUserId, otherName, appId });
    const msgs = appId
      ? await API.getApplicationThread(appId).catch(() => [])
      : await API.getConversation(otherUserId).catch(() => []);
    setThread(msgs);
  }

  async function doSendMessage() {
    if (!newMsg.trim() || !activeConv || !activeConv.otherUserId) return;
    try {
      await API.sendMessage({
        recipientId: activeConv.otherUserId,
        applicationId: activeConv.appId || null,
        content: newMsg,
      });
      setNewMsg("");
      const msgs = activeConv.appId
        ? await API.getApplicationThread(activeConv.appId).catch(() => [])
        : await API.getConversation(activeConv.otherUserId).catch(() => []);
      setThread(msgs);
    } catch (err) { setMsg("Send failed: " + err.message); setMsgType("error"); }
  }

  if (loading) return <Spinner />;

  const pf = profileForm;
  const setF = k => e => setProfileForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="dash-page">
      <div className="dash-in">
        <div className="dash-header">
          <div>
            <h1>Welcome, {user.fullName?.split(" ")[0]}! 👋</h1>
            <p>Manage your profile and track your applications.</p>
          </div>
          <button className="dash-logout" onClick={() => { logout(); navigate("/"); }}>Logout</button>
        </div>

        <div className="dash-stats">
          <div className="ds-card"><strong>{apps.length}</strong><span>Applications</span></div>
          <div className="ds-card"><strong>{apps.filter(a => a.status === "SHORTLISTED").length}</strong><span>Shortlisted</span></div>
          <div className="ds-card"><strong>{apps.filter(a => a.status === "HIRED").length}</strong><span>Hired</span></div>
          <div className="ds-card"><strong>{inbox.filter(m => !m.isRead).length}</strong><span>Unread Messages</span></div>
        </div>

        <div className="dash-tabs">
          {[["applications", "📋 Applications"], ["profile", "👤 My Profile"], ["messages", "💬 Messages"]].map(([id, label]) => (
            <button key={id} className={`dash-tab${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {msg && (
          <div className={msgType === "success" ? "success-msg" : msgType === "error" ? "form-err" : "info-msg"} style={{ marginBottom: 16 }}>
            {msg}
          </div>
        )}

        {/* ── APPLICATIONS TAB ── */}
        {tab === "applications" && (
          <div className="dash-panel">
            <h2>My Applications</h2>
            {apps.length === 0 ? (
              <div className="dash-empty">
                <p style={{ color: "var(--gray500)", marginBottom: 16 }}>No applications yet.</p>
                <button className="browse-btn" onClick={() => navigate("/jobs")}>Browse Jobs</button>
              </div>
            ) : (
              <div className="app-list">
                {apps.map(app => (
                  <div key={app.id} className="app-item">
                    <div className="app-info">
                      <strong>{app.job?.title}</strong>
                      <span>{app.job?.companyName}</span>
                      <small>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ""}</small>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span className="app-status" style={{ background: (STATUS_COLOR[app.status] || "#999") + "22", color: STATUS_COLOR[app.status] || "#999" }}>
                        {app.status}
                      </span>
                      <button className="btn-sm" title="Message employer" onClick={() => {
                        setTab("messages");
                        openConversation(app.employerUserId, app.employerName || app.job?.companyName, app.id);
                      }}>💬</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <form onSubmit={saveProfile}>
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <label>Full Name<input value={pf.fullName || ""} onChange={setF("fullName")} /></label>
                <label>Phone<input value={pf.phone || ""} onChange={setF("phone")} /></label>
                <label>Location<input value={pf.location || ""} onChange={setF("location")} placeholder="Addis Ababa" /></label>
                <label>Headline<input value={pf.headline || ""} onChange={setF("headline")} placeholder="Senior Software Engineer" /></label>
                <label className="span2">Professional Summary
                  <textarea rows={3} value={pf.summary || ""} onChange={setF("summary")} placeholder="Brief professional summary..." />
                </label>
              </div>
            </div>
            <div className="profile-section">
              <h3>Skills</h3>
              <textarea rows={3} value={pf.skills || ""} onChange={setF("skills")} placeholder="e.g. JavaScript, React, Node.js, Python (comma-separated or free text)" />
            </div>
            <div className="profile-section">
              <h3>Work History</h3>
              <textarea rows={5} value={pf.workHistory || ""} onChange={setF("workHistory")} placeholder="List your work experience, roles, companies, and dates..." />
            </div>
            <div className="profile-section">
              <h3>Education</h3>
              <textarea rows={4} value={pf.education || ""} onChange={setF("education")} placeholder="Degrees, institutions, graduation years..." />
            </div>
            <div className="profile-section">
              <h3>Links</h3>
              <div className="form-grid">
                <label>LinkedIn URL<input value={pf.linkedinUrl || ""} onChange={setF("linkedinUrl")} placeholder="https://linkedin.com/in/..." /></label>
                <label>Portfolio URL<input value={pf.portfolioUrl || ""} onChange={setF("portfolioUrl")} placeholder="https://yoursite.com" /></label>
              </div>
            </div>
            <div className="profile-section">
              <h3>Resume / CV</h3>
              {profile?.cvUrl && (
                <div style={{ marginBottom: 12, padding: "10px 14px", background: "var(--gray50)", borderRadius: "var(--r-sm)", fontSize: ".85rem" }}>
                  📄 Current CV: <a href={profile.cvUrl} target="_blank" rel="noreferrer" style={{ color: "var(--blue)", fontWeight: 700 }}>{profile.cvFilename || "Download"}</a>
                </div>
              )}
              <label className="upload-area">
                <input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={uploadCv} />
                <div>📤 Click to upload CV (PDF, DOC, DOCX — max 10MB)</div>
              </label>
            </div>
            <button type="submit" disabled={saving} className="auth-btn-full" style={{ maxWidth: 300 }}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === "messages" && (
          <div className="dash-panel">
            <h2>Messages</h2>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ width: 220, flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: ".82rem", color: "var(--gray500)", marginBottom: 10, textTransform: "uppercase" }}>Conversations</div>
                {inbox.length === 0 && <p style={{ color: "var(--gray500)", fontSize: ".85rem" }}>No messages yet.</p>}
                {inbox.map(m => (
                  <button key={m.id} onClick={() => openConversation(m.otherUserId, m.otherUserName, m.applicationId)}
                    style={{ width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: "var(--r-sm)", background: "var(--gray50)", marginBottom: 6, border: "1.5px solid var(--gray100)", cursor: "pointer" }}>
                    <div style={{ fontWeight: 700, fontSize: ".85rem", color: "var(--navy2)" }}>{m.otherUserName}</div>
                    <div style={{ fontSize: ".75rem", color: "var(--gray500)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.content}</div>
                    {!m.isRead && <span style={{ fontSize: ".7rem", background: "var(--blue)", color: "var(--white)", borderRadius: 20, padding: "1px 7px" }}>New</span>}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                {!activeConv ? (
                  <p style={{ color: "var(--gray500)" }}>Select a conversation or click 💬 on an application.</p>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, color: "var(--navy2)", marginBottom: 12 }}>
                      Chat with {activeConv.otherName || "Employer"}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
