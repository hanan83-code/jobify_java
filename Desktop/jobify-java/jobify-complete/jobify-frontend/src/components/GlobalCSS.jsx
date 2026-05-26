export default function GlobalCSS() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');`}</style>
      <style>{`
:root{--navy:#020c1e;--navy2:#071330;--navy3:#0a1f4e;--blue:#1a56db;--blue-lt:#dbeafe;--accent:#f59e0b;--green:#10b981;--red:#ef4444;--white:#fff;--gray50:#f8fafc;--gray100:#f1f5f9;--gray200:#e2e8f0;--gray300:#cbd5e1;--gray500:#64748b;--gray700:#334155;--font:'Plus Jakarta Sans',sans-serif;--serif:'DM Serif Display',serif;--r-sm:8px;--r-md:12px;--r-lg:18px;--r-xl:24px;--sh:0 4px 20px rgba(2,8,24,.13);--sh2:0 12px 40px rgba(2,8,24,.22);--tr:all .2s cubic-bezier(.4,0,.2,1);}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:var(--font);background:var(--gray50);color:var(--gray700);line-height:1.6;-webkit-font-smoothing:antialiased;}
a{text-decoration:none;color:inherit;}
button{font-family:var(--font);cursor:pointer;border:none;outline:none;background:none;}
input,select,textarea{font-family:var(--font);outline:none;border:1.5px solid var(--gray200);border-radius:var(--r-sm);padding:10px 14px;font-size:.9rem;transition:var(--tr);width:100%;background:var(--white);color:var(--gray700);}
input:focus,select:focus,textarea:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(26,86,219,.1);}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:var(--gray100);}::-webkit-scrollbar-thumb{background:var(--navy3);border-radius:8px;}
.nav{position:sticky;top:0;z-index:100;background:rgba(2,12,30,.96);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.07);}
.nav-in{max-width:1280px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;gap:24px;}
.nav-logo{display:flex;align-items:center;gap:8px;font-size:1.25rem;font-weight:800;color:var(--white);letter-spacing:-.5px;}
.nav-logo-accent{color:var(--accent);}
.nav-links{display:flex;gap:4px;margin-left:8px;}
.nav-link{color:rgba(255,255,255,.6);font-size:.875rem;font-weight:500;padding:8px 14px;border-radius:var(--r-sm);transition:var(--tr);}
.nav-link:hover,.nav-link.active{color:var(--white);background:rgba(255,255,255,.08);}
.nav-auth{display:flex;align-items:center;gap:8px;margin-left:auto;}
.nav-user{display:flex;align-items:center;gap:10px;}
.nav-name{color:rgba(255,255,255,.7);font-size:.85rem;font-weight:600;}
.btn-ghost{color:rgba(255,255,255,.65);font-size:.85rem;font-weight:600;padding:7px 14px;border-radius:var(--r-sm);transition:var(--tr);}
.btn-ghost:hover{background:rgba(255,255,255,.08);color:var(--white);}
.btn-outline-sm{border:1.5px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);font-size:.82rem;font-weight:600;padding:6px 14px;border-radius:var(--r-sm);transition:var(--tr);}
.btn-outline-sm:hover{border-color:rgba(255,255,255,.5);color:var(--white);}
.btn-primary{background:var(--blue);color:var(--white);font-weight:700;font-size:.85rem;padding:8px 18px;border-radius:var(--r-sm);transition:var(--tr);}
.btn-primary:hover{background:#1447b5;}
.btn-post{background:var(--accent);color:var(--navy2);font-weight:700;font-size:.82rem;padding:7px 14px;border-radius:var(--r-sm);transition:var(--tr);}
.btn-post:hover{background:#d97706;}
      `}</style>
    </>
  );
}
