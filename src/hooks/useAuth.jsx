import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true on first load

  /* On mount, check if a token exists and fetch the user profile */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { setLoading(false); return; }

    authApi.me()
      .then(setUser)
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { access_token } = await authApi.login(email, password);
    localStorage.setItem("access_token", access_token);
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (email, password, full_name) => {
    await authApi.register(email, password, full_name);
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
