import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../lib/storage";
import { authApi } from "../api/auth";

// small helper: decode JWT exp without libs
function getJwtExpMs(token) {
  try {
    const [, payload] = token.split(".");
    if (!payload) return 0;

    // handle base64url
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64));
    const expSec = Number(json?.exp || 0);
    return expSec ? expSec * 1000 : 0;
  } catch {
    return 0;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  //  Initialize from storage immediately (prevents empty token clearing storage)
  const [booting, setBooting] = useState(true);
  const [token, setToken] = useState(() => storage.getToken() || "");
  const [user, setUser] = useState(() => storage.getUser() || null);

  const isAuthed = useMemo(() => {
    if (!token) return false;

    const expMs = getJwtExpMs(token);
    if (!expMs) return true; // token without exp -> assume valid
    return Date.now() < expMs;
  }, [token]);

  // Boot validation (expiry check) once
  useEffect(() => {
    const t = storage.getToken();
    const u = storage.getUser();

    // Keep state in sync with storage on boot
    setToken(t || "");
    setUser(u || null);

    // If token exists but expired, clear
    if (t) {
      const expMs = getJwtExpMs(t);
      if (expMs && Date.now() >= expMs) {
        storage.clear();
        setToken("");
        setUser(null);
      }
    }

    setBooting(false);
  }, []);

  //  Only sync to storage AFTER booting is finished
  useEffect(() => {
    if (booting) return;
    storage.setToken(token);
  }, [token, booting]);

  useEffect(() => {
    if (booting) return;
    storage.setUser(user);
  }, [user, booting]);

  async function login(email, password) {
    // backend: POST /auth/login -> { token, user }
    const res = await authApi.login({ email, password });

    const nextToken = res?.token || "";
    const nextUser = res?.user || null;

    setToken(nextToken);
    setUser(nextUser);

    storage.setToken(nextToken);
    storage.setUser(nextUser);

    return res;
  }

  async function register(payload) {
    // backend: POST /auth/register -> returns user only (NO token)
    const res = await authApi.register(payload);
    return res;
  }

  async function refreshMe() {
    // backend: GET /auth/me -> returns current user
    const me = await authApi.me();
    setUser(me?.user || me); // support either {ok,user} or user
    storage.setUser(me?.user || me);
    return me;
  }

  function logout() {
    storage.clear();
    setToken("");
    setUser(null);
  }

  const value = {
    booting,
    loading: booting, // compatibility
    isAuthed,
    user,
    token,
    login,
    register,
    refreshMe,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
