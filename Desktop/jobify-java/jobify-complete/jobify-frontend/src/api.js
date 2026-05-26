// ─── API Layer ────────────────────────────────────────────────────────────────
export function getToken() {
  try { return JSON.parse(localStorage.getItem("jfy_auth"))?.token; } catch { return null; }
}

export async function api(method, path, body, isForm = false) {
  const token = getToken();
  const headers = {};
  if (token) headers["Authorization"] = "Bearer " + token;
  if (body && !isForm) headers["Content-Type"] = "application/json";

  const res = await fetch(path, {
    method,
    headers,
    body: isForm ? body : (body ? JSON.stringify(body) : undefined),
  });

  if (res.status === 204) return null;
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(typeof data === "string" ? data : (data?.message || `Request failed (${res.status})`));
  return data;
}

export const API = {
  // Auth
  login:    (email, password) => api("POST", "/api/auth/login", { email, password }),
  register: (body)            => api("POST", "/api/auth/register", body),

  // Jobs
  getJobs:           (params)          => api("GET", "/api/jobs?" + new URLSearchParams(params).toString()),
  getJob:            (id)              => api("GET", `/api/jobs/${id}`),
  createJob:         (body)            => api("POST", "/api/jobs", body),
  updateJobStatus:   (id, status)      => api("PATCH", `/api/jobs/${id}/status`, { status }),
  getJobQuestions:   (id)              => api("GET", `/api/jobs/${id}/questions`),
  updateJobQuestions:(id, questions)   => api("PUT", `/api/jobs/${id}/questions`, questions),

  // Categories
  getCategories: () => api("GET", "/api/categories"),

  // Companies
  getCompanies: ()   => api("GET", "/api/companies"),
  getCompany:   (id) => api("GET", `/api/companies/${id}`),

  // Applications
  apply:              (body)           => api("POST", "/api/applications", body),
  checkApplied:       (jobId)          => api("GET", `/api/applications/check/${jobId}`),
  getMyApplications:  (seekerId, page) => api("GET", `/api/applications/seeker/${seekerId}?page=${page ?? 0}&size=20`),
  getJobApplications: (jobId, page)    => api("GET", `/api/applications/job/${jobId}?page=${page ?? 0}&size=50`),
  updateAppStatus:    (id, status)     => api("PATCH", `/api/applications/${id}/status`, { status }),
  getAppAnswers:      (id)             => api("GET", `/api/applications/${id}/answers`),

  // Employer
  getEmployerStats: ()     => api("GET", "/api/employer/stats"),
  getEmployerJobs:  (page) => api("GET", `/api/employer/jobs?page=${page ?? 0}&size=50`),
  getMyCompany:     ()     => api("GET", "/api/employer/company"),
  updateMyCompany:  (body) => api("PATCH", "/api/employer/company", body),
  uploadLogo: (file) => {
    const fd = new FormData(); fd.append("file", file);
    return api("POST", "/api/employer/company/logo", fd, true);
  },

  // Seeker profile
  getSeekerProfile:    ()     => api("GET", "/api/seeker/profile"),
  updateSeekerProfile: (body) => api("PUT", "/api/seeker/profile", body),
  uploadCv: (file) => {
    const fd = new FormData(); fd.append("file", file);
    return api("POST", "/api/seeker/profile/cv", fd, true);
  },

  // Messages
  sendMessage:          (body)        => api("POST", "/api/messages", body),
  getConversation:      (otherUserId) => api("GET", `/api/messages/conversation/${otherUserId}`),
  getApplicationThread: (appId)       => api("GET", `/api/messages/application/${appId}`),
  getInbox:             (page)        => api("GET", `/api/messages/inbox?page=${page ?? 0}&size=20`),
  getUnreadCount:       ()            => api("GET", "/api/messages/unread-count"),
};
