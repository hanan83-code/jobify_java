import { createContext, useContext, useState } from "react";
import { API } from "./api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem("jfy_auth")); } catch { return null; }
  });

  const login = async (email, password) => {
    const data = await API.login(email, password);
    localStorage.setItem("jfy_auth", JSON.stringify(data));
    setAuth(data);
    return data;
  };

  const register = async (body) => {
    const data = await API.register(body);
    localStorage.setItem("jfy_auth", JSON.stringify(data));
    setAuth(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("jfy_auth");
    setAuth(null);
  };

  const user = auth?.user || null;
  return (
    <AuthCtx.Provider value={{ user, auth, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
