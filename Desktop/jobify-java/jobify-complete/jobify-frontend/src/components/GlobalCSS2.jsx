export default function GlobalCSS2() {
  return (
    <style>{`
.hero{position:relative;overflow:hidden;background:var(--navy);padding:100px 24px 90px;text-align:center;}
.hero-glow{position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% -10%,rgba(26,86,219,.5),transparent),radial-gradient(ellipse 50% 40% at 80% 80%,rgba(26,86,219,.15),transparent);}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:60px 60px;}
.hero-content{position:relative;max-width:800px;margin:0 auto;}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(26,86,219,.15);border:1px solid rgba(26,86,219,.35);color:#93c5fd;font-size:.78rem;font-weight:700;padding:5px 14px;border-radius:20px;margin-bottom:28px;letter-spacing:.6px;text-transform:uppercase;}
.hero h1{font-size:clamp(2.4rem,5.5vw,3.8rem);font-weight:800;color:var(--white);line-height:1.15;margin-bottom:20px;letter-spacing:-.8px;}
.hero-serif{font-family:var(--serif);font-style:italic;color:var(--accent);}
.hero p{color:rgba(255,255,255,.55);font-size:1.05rem;max-width:540px;margin:0 auto 40px;}
.search-bar{display:flex;align-items:center;background:var(--white);border-radius:var(--r-xl);padding:7px;gap:0;box-shadow:0 12px 48px rgba(0,0,0,.45);margin-bottom:22px;}
.sf{display:flex;align-items:center;gap:10px;flex:1;padding:8px 18px;}
.sf input{border:none;padding:4px 0;font-size:.95rem;background:transparent;}
.sf input:focus{box-shadow:none;border:none;}
.sf-icon{font-size:1rem;flex-shrink:0;}
.sf-div{width:1px;height:36px;background:var(--gray200);flex-shrink:0;}
.search-submit{background:var(--blue);color:var(--white);padding:13px 32px;border-radius:var(--r-lg);font-weight:700;font-size:.95rem;white-space:nowrap;transition:var(--tr);}
.search-submit:hover{background:#1447b5;transform:scale(1.02);}
.hero-tags{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;font-size:.8rem;}
.hero-tags-label{color:rgba(255,255,255,.4);}
.hero-tag{background:rgba(255,255,255,.07);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.1);padding:5px 14px;border-radius:20px;font-size:.78rem;transition:var(--tr);}
.hero-tag:hover{background:rgba(255,255,255,.14);color:var(--white);}
.stats-bar{background:var(--navy2);display:flex;justify-content:center;flex-wrap:wrap;}
.stat-item{display:flex;flex-direction:column;align-items:center;padding:24px 52px;border-right:1px solid rgba(255,255,255,.06);}
.stat-item:last-child{border-right:none;}
.stat-val{font-size:1.75rem;font-weight:800;color:var(--white);}
.stat-lbl{font-size:.78rem;color:rgba(255,255,255,.4);margin-top:2px;}
.section{padding:80px 24px;}.section-alt{background:var(--white);}
.section-in{max-width:1280px;margin:0 auto;}
.section-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px;}
.section-hdr h2{font-size:1.85rem;font-weight:800;color:var(--navy2);letter-spacing:-.4px;}
.section-hdr h2 span{color:var(--blue);}
.section-hdr p{color:var(--gray500);font-size:.9rem;}
.view-all-btn{background:transparent;color:var(--blue);font-weight:700;font-size:.9rem;transition:var(--tr);}
.view-all-btn:hover{color:var(--navy2);}
.cats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px;}
.cat-card{background:var(--white);border:1.5px solid var(--gray100);border-radius:var(--r-lg);padding:22px 18px;text-align:left;display:flex;flex-direction:column;gap:8px;transition:var(--tr);cursor:pointer;}
.cat-card:hover{border-color:var(--blue);transform:translateY(-3px);box-shadow:var(--sh);}
.cat-icon{font-size:1.8rem;}.cat-name{font-weight:700;color:var(--navy2);font-size:.92rem;}.cat-cnt{font-size:.78rem;color:var(--gray500);}
.cta-sec{background:linear-gradient(135deg,var(--navy2),var(--navy3));padding:80px 24px;}
.cta-in{max-width:900px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:40px;flex-wrap:wrap;}
.cta-text h2{font-size:2rem;font-weight:800;color:var(--white);letter-spacing:-.4px;margin-bottom:10px;}
.cta-text p{color:rgba(255,255,255,.55);font-size:1rem;max-width:480px;}
.cta-actions{display:flex;gap:12px;flex-wrap:wrap;}
.cta-btn{background:var(--accent);color:var(--navy2);font-weight:800;font-size:.95rem;padding:14px 28px;border-radius:var(--r-md);transition:var(--tr);}
.cta-btn:hover{background:#d97706;transform:scale(1.03);}
.cta-btn-outline{background:transparent;border:2px solid rgba(255,255,255,.25);color:var(--white);font-weight:700;font-size:.95rem;padding:13px 28px;border-radius:var(--r-md);transition:var(--tr);}
.cta-btn-outline:hover{border-color:rgba(255,255,255,.55);}
    `}</style>
  );
}
