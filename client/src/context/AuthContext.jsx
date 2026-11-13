import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken } from "../api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (getToken()) api("/auth/me").then(d => setUser(d.user)).catch(() => localStorage.removeItem("learnhub_token")).finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  const login = async (email, password) => {
    const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem("learnhub_token", data.token); setUser(data.user);
  };
  const register = async (name, email, password) => {
    const data = await api("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
    localStorage.setItem("learnhub_token", data.token); setUser(data.user);
  };
  const logout = () => { localStorage.removeItem("learnhub_token"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser: async () => { const d = await api("/auth/me"); setUser(d.user); } }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
