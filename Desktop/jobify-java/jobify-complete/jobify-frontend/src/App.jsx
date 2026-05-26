import { useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { useRoute, navigate } from "./router";

import GlobalCSS  from "./components/GlobalCSS";
import GlobalCSS2 from "./components/GlobalCSS2";
import GlobalCSS3 from "./components/GlobalCSS3";
import GlobalCSS4 from "./components/GlobalCSS4";
import Navbar  from "./components/Navbar";
import Footer  from "./components/Footer";

import HomePage       from "./pages/HomePage";
import JobsPage       from "./pages/JobsPage";
import JobDetailPage  from "./pages/JobDetailPage";
import LoginPage      from "./pages/LoginPage";
import RegisterPage   from "./pages/RegisterPage";
import PostJobPage    from "./pages/PostJobPage";
import CompaniesPage  from "./pages/CompaniesPage";
import CategoriesPage from "./pages/CategoriesPage";
import SeekerDashboard   from "./pages/SeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";

/* ── Dashboard router ─────────────────────────────────────────── */
function Dashboard() {
  const { user } = useAuth();
  useEffect(() => { if (!user) navigate("/login"); }, [user]);
  if (!user) return null;
  if (user.role === "EMPLOYER") return <EmployerDashboard />;
  return <SeekerDashboard />;
}

/* ── Page router ──────────────────────────────────────────────── */
function Pages() {
  const full = useRoute();
  const [route, search] = full.split("?");
  const searchStr = search || "";

  if (route === "/" || route === "")        return <HomePage />;
  if (route === "/login")                   return <LoginPage />;
  if (route.startsWith("/register"))        return <RegisterPage searchStr={searchStr} />;
  if (route === "/jobs")                    return <JobsPage searchStr={searchStr} />;
  if (route.startsWith("/jobs/")) {
    const id = route.split("/")[2];
    return <JobDetailPage id={id} />;
  }
  if (route === "/dashboard")               return <Dashboard />;
  if (route === "/post-job")                return <PostJobPage />;
  if (route === "/companies")               return <CompaniesPage />;
  if (route === "/categories")              return <CategoriesPage />;

  return (
    <div className="not-found">
      <h2>404 — Page not found</h2>
      <button className="nf-go" onClick={() => navigate("/")}>← Go Home</button>
    </div>
  );
}

/* ── Root ─────────────────────────────────────────────────────── */
function Inner() {
  const full = useRoute();
  const [route] = full.split("?");
  return (
    <>
      <Navbar path={route} />
      <main><Pages /></main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GlobalCSS />
      <GlobalCSS2 />
      <GlobalCSS3 />
      <GlobalCSS4 />
      <Inner />
    </AuthProvider>
  );
}
