import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { booting, isAuthed, user } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-sm text-zinc-600">
        Loading...
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  const isAdmin = (user?.role || "").toUpperCase() === "ADMIN";
  if (!isAdmin) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
