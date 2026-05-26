import { navigate } from "../router";

const TYPE_COLORS = {
  FULL_TIME: "#10b981", PART_TIME: "#f59e0b", CONTRACT: "#3b82f6",
  INTERNSHIP: "#8b5cf6", FREELANCE: "#ec4899",
};

function Logo({ url, name, size = 44 }) {
  if (url) return <img src={url} alt={name} style={{ width: size, height: size, objectFit: "cover" }} />;
  return <span style={{ fontSize: size * 0.4 }}>{name?.[0] ?? "?"}</span>;
}

export default function JobCard({ job, variant = "grid" }) {
  const daysAgo = job.createdAt ? Math.floor((Date.now() - new Date(job.createdAt)) / 86400000) : 0;
  const color = TYPE_COLORS[job.jobType] || "#64748b";
  const timeLabel = daysAgo === 0 ? "Today" : `${daysAgo}d ago`;

  if (variant === "row") {
    return (
      <div className="job-row" onClick={() => navigate(`/jobs/${job.id}`)}>
        <div className="jr-logo"><Logo url={job.companyLogo} name={job.companyName} size={52} /></div>
        <div className="jr-body">
          <div className="jr-title">{job.title}</div>
          <div className="jr-co">{job.companyName}</div>
          <div className="jr-tags">
            {job.location && <span className="jr-tag">📍 {job.location}</span>}
            {job.isRemote && <span className="jr-tag">🌐 Remote</span>}
            {job.categoryName && <span className="jr-tag">🏷️ {job.categoryName}</span>}
            {job.experienceYears != null && <span className="jr-tag">⏱️ {job.experienceYears}+ yrs</span>}
          </div>
        </div>
        <div className="jr-right">
          {job.salaryMin && (
            <div className="jr-salary">{job.salaryCurrency} {Number(job.salaryMin).toLocaleString()}+</div>
          )}
          <span className="jr-type-badge" style={{ background: color + "22", color }}>
            {job.jobType?.replace("_", " ")}
          </span>
          <div style={{ fontSize: ".72rem", color: "var(--gray300)", marginTop: 6 }}>{timeLabel}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
      <div className="jc-header">
        <div className="jc-logo"><Logo url={job.companyLogo} name={job.companyName} size={44} /></div>
        <div className="jc-meta">
          <div className="jc-co">{job.companyName}</div>
          <div className="jc-time">{timeLabel}</div>
        </div>
        <span className="jc-type" style={{ background: color + "22", color }}>
          {job.jobType?.replace("_", " ")}
        </span>
      </div>
      <div className="jc-title">{job.title}</div>
      <div className="jc-tags">
        {job.location && <span className="jc-tag">📍 {job.location}</span>}
        {job.isRemote && <span className="jc-tag remote">🌐 Remote</span>}
        {job.categoryName && <span className="jc-tag">🏷️ {job.categoryName}</span>}
      </div>
      {(job.salaryMin || job.salaryMax) && (
        <div className="jc-salary">
          💰 {job.salaryCurrency} {Number(job.salaryMin).toLocaleString()} – {Number(job.salaryMax).toLocaleString()}
        </div>
      )}
      {job.deadline && (
        <div className="jc-deadline">Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
      )}
    </div>
  );
}
