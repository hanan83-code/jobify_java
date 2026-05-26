export default function GlobalCSS3() {
  return (
    <style>{`
.footer{background:var(--navy);border-top:1px solid rgba(255,255,255,.05);}
.footer-in{max-width:1280px;margin:0 auto;padding:60px 24px 40px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;}
.footer-logo{font-size:1.3rem;font-weight:800;color:var(--white);margin-bottom:12px;}
.footer-logo span{color:var(--accent);}
.footer-desc{color:rgba(255,255,255,.35);font-size:.85rem;line-height:1.7;}
.footer-col h4{color:rgba(255,255,255,.5);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:14px;}
.footer-link{display:block;color:rgba(255,255,255,.45);font-size:.85rem;margin-bottom:8px;transition:var(--tr);}
.footer-link:hover{color:var(--white);}
.footer-btm{max-width:1280px;margin:0 auto;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.06);gap:16px;flex-wrap:wrap;}
.footer-copy{color:rgba(255,255,255,.3);font-size:.8rem;}
.footer-legal{display:flex;gap:20px;}
.footer-legal a{color:rgba(255,255,255,.3);font-size:.8rem;transition:var(--tr);}
.footer-legal a:hover{color:rgba(255,255,255,.6);}
.auth-page{min-height:calc(100vh - 64px);background:var(--navy);display:flex;align-items:center;justify-content:center;padding:40px 24px;background-image:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(26,86,219,.35),transparent);}
.auth-card{background:var(--white);border-radius:var(--r-xl);padding:44px;width:100%;max-width:430px;box-shadow:var(--sh2);}
.auth-brand{font-size:1.3rem;font-weight:800;color:var(--navy2);text-align:center;margin-bottom:28px;}
.auth-card h2{font-size:1.65rem;font-weight:800;color:var(--navy2);text-align:center;}
.auth-sub{color:var(--gray500);text-align:center;margin-bottom:28px;}
.auth-err{background:#fee2e2;color:var(--red);border-radius:var(--r-sm);padding:10px 14px;font-size:.85rem;margin-bottom:16px;}
.role-toggle{display:flex;gap:8px;margin-bottom:22px;background:var(--gray50);padding:4px;border-radius:var(--r-sm);}
.role-btn{flex:1;padding:10px;border-radius:6px;font-size:.85rem;font-weight:600;background:transparent;color:var(--gray500);transition:var(--tr);}
.role-btn.active{background:var(--white);color:var(--navy2);box-shadow:var(--sh);}
.auth-form{display:flex;flex-direction:column;gap:16px;}
.auth-form label{display:flex;flex-direction:column;gap:6px;font-size:.83rem;font-weight:700;color:var(--navy2);}
.auth-btn-full{background:var(--blue);color:var(--white);padding:13px;border-radius:var(--r-sm);font-weight:700;font-size:.95rem;width:100%;transition:var(--tr);}
.auth-btn-full:hover:not(:disabled){background:#1447b5;}
.auth-btn-full:disabled{opacity:.6;cursor:not-allowed;}
.auth-footer{text-align:center;margin-top:20px;color:var(--gray500);font-size:.875rem;}
.auth-footer a{color:var(--blue);font-weight:600;}
.jobs-topbar{background:var(--navy2);padding:24px;}
.jobs-topbar-in{max-width:1280px;margin:0 auto;}
.jobs-search-bar{display:flex;gap:10px;flex-wrap:wrap;}
.jobs-search-bar input,.jobs-search-bar select{background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.12);color:var(--white);border-radius:var(--r-sm);}
.jobs-search-bar input::placeholder{color:rgba(255,255,255,.4);}
.jobs-search-bar input:focus,.jobs-search-bar select:focus{border-color:rgba(255,255,255,.4);box-shadow:none;background:rgba(255,255,255,.12);}
.jobs-search-bar select option{background:var(--navy2);color:var(--white);}
.jobs-layout{max-width:1280px;margin:0 auto;padding:32px 24px;display:flex;gap:28px;align-items:flex-start;}
.jobs-sidebar{width:240px;flex-shrink:0;}
.sidebar-box{background:var(--white);border:1.5px solid var(--gray100);border-radius:var(--r-lg);padding:22px;}
.sidebar-box h3{font-size:.82rem;font-weight:800;color:var(--navy2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:14px;}
.sidebar-item{display:flex;align-items:center;gap:8px;padding:7px 0;cursor:pointer;font-size:.85rem;color:var(--gray700);}
.sidebar-item input{width:auto;flex-shrink:0;}
.sidebar-cnt{margin-left:auto;font-size:.75rem;color:var(--gray300);}
.jobs-main{flex:1;min-width:0;}
.jobs-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;}
.jobs-count{font-size:.9rem;color:var(--gray500);font-weight:600;}
.jobs-list{display:flex;flex-direction:column;gap:14px;}
.job-row{background:var(--white);border:1.5px solid var(--gray100);border-radius:var(--r-lg);padding:22px;display:flex;align-items:center;gap:18px;transition:var(--tr);cursor:pointer;}
.job-row:hover{border-color:var(--blue);box-shadow:var(--sh);}
.jr-logo{width:52px;height:52px;border-radius:var(--r-md);background:var(--navy3);display:grid;place-items:center;font-weight:800;color:var(--white);font-size:1.1rem;flex-shrink:0;overflow:hidden;}
.jr-logo img{width:100%;height:100%;object-fit:cover;}
.jr-body{flex:1;min-width:0;}
.jr-title{font-size:1rem;font-weight:700;color:var(--navy2);margin-bottom:4px;}
.jr-co{font-size:.83rem;color:var(--gray500);font-weight:600;margin-bottom:6px;}
.jr-tags{display:flex;flex-wrap:wrap;gap:6px;}
.jr-tag{font-size:.73rem;color:var(--gray500);background:var(--gray50);border:1px solid var(--gray100);padding:3px 10px;border-radius:20px;}
.jr-right{text-align:right;flex-shrink:0;}
.jr-salary{font-size:.85rem;font-weight:700;color:var(--green);margin-bottom:6px;}
.jr-type-badge{font-size:.73rem;font-weight:700;padding:4px 10px;border-radius:20px;white-space:nowrap;}
.pagination{display:flex;gap:8px;justify-content:center;margin-top:32px;flex-wrap:wrap;}
.pg-btn{padding:8px 16px;border-radius:var(--r-sm);border:1.5px solid var(--gray200);background:var(--white);color:var(--gray700);font-weight:600;font-size:.85rem;transition:var(--tr);}
.pg-btn:hover:not(:disabled){border-color:var(--blue);color:var(--blue);}
.pg-btn.active{background:var(--blue);color:var(--white);border-color:var(--blue);}
.pg-btn:disabled{opacity:.4;cursor:not-allowed;}
.empty-state{text-align:center;padding:60px 20px;background:var(--white);border-radius:var(--r-lg);border:1.5px solid var(--gray100);}
.empty-state .es-icon{font-size:3rem;display:block;margin-bottom:16px;}
.empty-state h3{font-size:1.2rem;font-weight:700;color:var(--navy2);margin-bottom:8px;}
.empty-state p{color:var(--gray500);}
    `}</style>
  );
}
