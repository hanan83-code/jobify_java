import { useState, useEffect } from "react";

export function useRoute() {
  const [path, setPath] = useState(window.location.hash.slice(1) || "/");
  useEffect(() => {
    const h = () => setPath(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  return path;
}

export function navigate(to) {
  window.location.hash = to;
}

export function Link({ to, children, className, style, onClick }) {
  return (
    <a href={`#${to}`} className={className} style={style} onClick={onClick}>
      {children}
    </a>
  );
}
