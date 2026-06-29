import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi } from "../api/client.js";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("access_token");
    if (!t) { setLoading(false); return; }
    authApi.me().then(setUser).catch(() => localStorage.removeItem("access_token")).finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { access_token } = await authApi.login(email, password);
    localStorage.setItem("access_token", access_token);
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (email, password, profession) => {
    await authApi.register(email, password, profession);
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}
