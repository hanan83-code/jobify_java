export default function GlobalCSS4() {
  return (
    <style>{`
.jobs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px;}
.job-card{background:var(--white);border:1.5px solid var(--gray100);border-radius:var(--r-lg);padding:22px;display:flex;flex-direction:column;gap:12px;transition:var(--tr);cursor:pointer;}
.job-card:hover{border-color:var(--blue);transform:translateY(-3px);box-shadow:var(--sh);}
.jc-header{display:flex;align-items:center;gap:12px;}
.jc-logo{width:44px;height:44px;border-radius:var(--r-md);background:var(--navy3);display:grid;place-items:center;font-weight:800;color:var(--white);font-size:1rem;flex-shrink:0;overflow:hidden;}
.jc-logo img{width:100%;height:100%;object-fit:cover;}
.jc-meta{flex:1;min-width:0;}.jc-co{font-size:.8rem;color:var(--gray500);font-weight:600;}.jc-time{font-size:.73rem;color:var(--gray300);}
.jc-type{font-size:.73rem;font-weight:700;padding:4px 10px;border-radius:20px;}
.jc-title{font-size:1rem;font-weight:700;color:var(--navy2);line-height:1.35;}
.jc-tags{display:flex;flex-wrap:wrap;gap:6px;}
.jc-tag{font-size:.75rem;color:var(--gray500);background:var(--gray50);border:1px solid var(--gray100);padding:3px 10px;border-radius:20px;}
.jc-tag.remote{color:#0891b2;background:#ecfeff;border-color:#a5f3fc;}
.jc-salary{font-size:.82rem;font-weight:700;color:var(--green);}
.jc-deadline{font-size:.75rem;color:var(--gray500);}
.jd-page{max-width:900px;margin:0 auto;padding:40px 24px;}
.jd-card{background:var(--white);border:1.5px solid var(--gray100);border-radius:var(--r-xl);overflow:hidden;box-shadow:var(--sh);}
.jd-banner{background:linear-gradient(135deg,var(--navy2),var(--navy3));padding:36px;display:flex;align-items:flex-start;gap:24px;}
.jd-logo{width:64px;height:64px;border-radius:var(--r-lg);background:rgba(255,255,255,.12);display:grid;place-items:center;font-weight:800;color:var(--white);font-size:1.4rem;flex-shrink:0;overflow:hidden;}
.jd-logo img{width:100%;height:100%;object-fit:cover;}
.jd-title-block{flex:1;}
.jd-title-block h1{font-size:1.65rem;font-weight:800;color:var(--white);margin-bottom:4px;}
.jd-co{color:rgba(255,255,255,.65);font-size:.95rem;font-weight:600;margin-bottom:12px;}
.jd-meta-tags{display:flex;flex-wrap:wrap;gap:8px;}
.jd-tag{font-size:.78rem;font-weight:600;padding:5px 12px;border-radius:20px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);}
.jd-tag.remote{background:rgba(16,185,129,.15);color:#6ee7b7;}
.jd-body{padding:36px;}
.jd-info-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-bottom:32px;}
.info-chip{background:var(--gray50);border:1.5px solid var(--gray100);border-radius:var(--r-md);padding:14px 18px;display:flex;flex-direction:column;gap:4px;}
.info-chip strong{font-size:.75rem;font-weight:700;color:var(--gray500);text-transform:uppercase;letter-spacing:.4px;}
.info-chip span{font-size:.9rem;font-weight:700;color:var(--navy2);}
.jd-section{margin-bottom:28px;}
.jd-section h2{font-size:1.05rem;font-weight:800;color:var(--navy2);margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid var(--blue-lt);}
.jd-prose{color:var(--gray700);font-size:.9rem;line-height:1.8;white-space:pre-wrap;}
.apply-btn{background:var(--blue);color:var(--white);font-weight:700;padding:13px 28px;border-radius:var(--r-md);transition:var(--tr);font-size:.95rem;}
.apply-btn:hover{background:#1447b5;}
.apply-form-card{background:var(--blue-lt);border:1.5px solid #bfdbfe;border-radius:var(--r-lg);padding:28px;margin-bottom:28px;}
.apply-form-card h3{font-size:1rem;font-weight:800;color:var(--navy2);margin-bottom:16px;}
.form-err{background:#fee2e2;color:var(--red);border-radius:var(--r-sm);padding:10px 14px;font-size:.85rem;margin-bottom:14px;}
.applied-badge{background:#d1fae5;color:#065f46;font-weight:700;font-size:.9rem;padding:10px 20px;border-radius:var(--r-md);display:flex;align-items:center;gap:6px;}
.cancel-btn{background:transparent;color:var(--gray500);font-weight:600;font-size:.85rem;padding:10px 18px;border:1.5px solid var(--gray200);border-radius:var(--r-sm);transition:var(--tr);}
.cancel-btn:hover{border-color:var(--gray500);color:var(--gray700);}
.back-btn{display:flex;align-items:center;gap:6px;color:var(--gray500);font-size:.85rem;font-weight:600;margin-bottom:24px;transition:var(--tr);background:none;border:none;cursor:pointer;}
.back-btn:hover{color:var(--navy2);}
.dash-page{padding:40px 24px;min-height:calc(100vh - 64px);background:var(--gray50);}
.dash-in{max-width:1100px;margin:0 auto;}
.dash-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;flex-wrap:wrap;gap:16px;}
.dash-header h1{font-size:1.8rem;font-weight:800;color:var(--navy2);letter-spacing:-.4px;margin-bottom:4px;}
.dash-header p{color:var(--gray500);}
.dash-logout{background:transparent;border:1.5px solid var(--gray200);color:var(--gray500);padding:8px 20px;border-radius:var(--r-sm);font-weight:700;font-size:.85rem;transition:var(--tr);}
.dash-logout:hover{border-color:var(--red);color:var(--red);}
.dash-stats{display:flex;gap:16px;margin-bottom:32px;flex-wrap:wrap;}
.ds-card{flex:1;min-width:140px;background:var(--white);border:1.5px solid var(--gray100);border-radius:var(--r-lg);padding:24px;display:flex;flex-direction:column;gap:4px;}
.ds-card strong{font-size:2.2rem;font-weight:800;color:var(--navy2);}
.ds-card span{font-size:.8rem;color:var(--gray500);}
.dash-panel{background:var(--white);border:1.5px solid var(--gray100);border-radius:var(--r-xl);padding:28px;margin-bottom:20px;}
.dash-panel h2{font-size:1.1rem;font-weight:800;color:var(--navy2);margin-bottom:20px;}
.dash-tabs{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;}
.dash-tab{padding:8px 18px;border-radius:var(--r-sm);border:1.5px solid var(--gray200);background:var(--white);font-weight:700;font-size:.83rem;color:var(--gray500);transition:var(--tr);}
.dash-tab.active{background:var(--blue);color:var(--white);border-color:var(--blue);}
.dash-tab:hover:not(.active){border-color:var(--blue);color:var(--blue);}
.app-list{display:flex;flex-direction:column;gap:10px;}
.app-item{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;background:var(--gray50);border-radius:var(--r-md);}
.app-info strong{font-weight:700;color:var(--navy2);font-size:.9rem;display:block;}
.app-info span{color:var(--gray500);font-size:.82rem;}
.app-info small{color:var(--gray300);font-size:.75rem;}
.app-status{padding:4px 12px;border-radius:20px;font-size:.75rem;font-weight:700;white-space:nowrap;}
.status-sel{padding:6px 10px;border-radius:6px;border:1px solid var(--gray200);font-size:.8rem;width:auto;background:var(--white);}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;}
.form-grid label{display:flex;flex-direction:column;gap:6px;font-size:.83rem;font-weight:700;color:var(--navy2);}
.span2{grid-column:span 2;}
.checkbox-label{flex-direction:row!important;align-items:center;gap:10px;}
.checkbox-label input{width:auto;}
.dash-empty{text-align:center;padding:48px 20px;}
.browse-btn{background:var(--blue);color:var(--white);padding:11px 24px;border-radius:var(--r-sm);font-weight:700;font-size:.88rem;transition:var(--tr);display:inline-block;}
.browse-btn:hover{background:#1447b5;}
.success-card{text-align:center;background:var(--white);border:1.5px solid var(--gray100);border-radius:var(--r-xl);padding:60px 40px;max-width:500px;margin:60px auto;}
.success-icon{font-size:3rem;display:block;margin-bottom:20px;}
.success-card h2{font-size:1.5rem;font-weight:800;color:var(--navy2);margin-bottom:10px;}
.success-card p{color:var(--gray500);margin-bottom:28px;}
.page-hero{background:var(--navy2);padding:48px 24px 40px;text-align:center;}
.page-hero h1{font-size:2rem;font-weight:800;color:var(--white);margin-bottom:8px;}
.page-hero p{color:rgba(255,255,255,.5);font-size:.95rem;}
.company-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
.company-card{background:var(--white);border:1.5px solid var(--gray100);border-radius:var(--r-lg);padding:22px;transition:var(--tr);}
.company-card:hover{border-color:var(--blue);box-shadow:var(--sh);}
.co-avatar{width:50px;height:50px;border-radius:var(--r-md);background:var(--navy3);display:grid;place-items:center;font-weight:800;color:var(--white);font-size:1.1rem;overflow:hidden;}
.co-avatar img{width:100%;height:100%;object-fit:cover;}
.co-name{font-weight:800;color:var(--navy2);font-size:.95rem;}
.co-detail{font-size:.83rem;color:var(--gray500);}
.co-desc{font-size:.85rem;color:var(--gray700);line-height:1.6;margin-top:10px;}
.verified-badge{font-size:.72rem;font-weight:700;background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:20px;}
.spinner{width:36px;height:36px;border:3px solid var(--gray100);border-top-color:var(--blue);border-radius:50%;animation:spin .7s linear infinite;margin:60px auto;}
@keyframes spin{to{transform:rotate(360deg)}}
.not-found{text-align:center;padding:100px 24px;}
.not-found h2{font-size:2rem;font-weight:800;color:var(--navy2);margin-bottom:16px;}
.nf-go{color:var(--blue);font-weight:700;background:none;border:none;cursor:pointer;font-size:1rem;}
.msg-thread{display:flex;flex-direction:column;gap:10px;max-height:400px;overflow-y:auto;padding:4px;}
.msg-bubble{max-width:75%;padding:10px 14px;border-radius:var(--r-lg);font-size:.88rem;line-height:1.5;}
.msg-bubble.mine{background:var(--blue);color:var(--white);align-self:flex-end;border-bottom-right-radius:4px;}
.msg-bubble.theirs{background:var(--gray100);color:var(--gray700);align-self:flex-start;border-bottom-left-radius:4px;}
.msg-time{font-size:.7rem;opacity:.6;margin-top:4px;}
.msg-input-row{display:flex;gap:8px;margin-top:12px;}
.msg-input-row input{flex:1;}
.msg-send-btn{background:var(--blue);color:var(--white);padding:10px 20px;border-radius:var(--r-sm);font-weight:700;font-size:.85rem;white-space:nowrap;transition:var(--tr);}
.msg-send-btn:hover{background:#1447b5;}
.profile-section{background:var(--white);border:1.5px solid var(--gray100);border-radius:var(--r-xl);padding:28px;margin-bottom:20px;}
.profile-section h3{font-size:1rem;font-weight:800;color:var(--navy2);margin-bottom:18px;padding-bottom:10px;border-bottom:2px solid var(--blue-lt);}
.upload-area{border:2px dashed var(--gray200);border-radius:var(--r-lg);padding:24px;text-align:center;cursor:pointer;transition:var(--tr);display:block;}
.upload-area:hover{border-color:var(--blue);background:var(--blue-lt);}
.q-row{display:flex;gap:8px;align-items:flex-start;margin-bottom:10px;}
.q-row input{flex:1;}
.q-remove{color:var(--red);font-size:1.2rem;padding:8px;flex-shrink:0;background:none;border:none;cursor:pointer;}
.btn-sm{padding:6px 14px;border-radius:6px;font-size:.78rem;font-weight:700;background:var(--blue);color:var(--white);transition:var(--tr);}
.btn-sm:hover{opacity:.85;}
.info-msg{background:#fef3c7;color:#92400e;padding:10px 16px;border-radius:var(--r-sm);margin-bottom:16px;font-size:.88rem;}
.success-msg{background:#d1fae5;color:#065f46;padding:10px 16px;border-radius:var(--r-sm);margin-bottom:16px;font-size:.88rem;}
@media(max-width:900px){.footer-in{grid-template-columns:1fr 1fr;}.form-grid{grid-template-columns:1fr;}.span2{grid-column:span 1;}.jobs-layout{flex-direction:column;}.jobs-sidebar{width:100%;}.stat-item{padding:20px 28px;}.jd-banner{flex-direction:column;}}
@media(max-width:600px){.nav-links{display:none;}.hero h1{font-size:2rem;}.search-bar{flex-direction:column;padding:14px;}.sf-div{display:none;}.cta-in{flex-direction:column;}.footer-in{grid-template-columns:1fr;}}
    `}</style>
  );
}
