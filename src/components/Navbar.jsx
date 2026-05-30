// src/components/Navbar.jsx
import React, { useMemo, useState } from "react";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

function getTitle(pathname) {
  const rules = [
    { re: /^\/app\/admin\/schedule/, title: "Full Schedule" },
    { re: /^\/app\/admin\/rooms/, title: "Manage Rooms" },
    { re: /^\/app\/admin\/activity/, title: "Activity Logs" },
    { re: /^\/app\/timeline/, title: "Day View" },
    { re: /^\/app\/my-bookings/, title: "My Bookings" },
    { re: /^\/app\/rooms/, title: "Rooms" },
    { re: /^\/app\/reminders/, title: "Reminders" },
    { re: /^\/app\/?$/, title: "Dashboard" },
  ];
  for (const r of rules) if (r.re.test(pathname)) return r.title;
  return "Dashboard";
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isAdmin = (user?.role || "").toUpperCase() === "ADMIN";
  const title = useMemo(() => getTitle(location.pathname), [location.pathname]);

  function doLogout() {
    logout();
    nav("/", { replace: true });
  }

  return (
    <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={user ? "/app" : "/"} className="font-semibold">
            Boardroom
          </Link>
          <span className="text-sm text-zinc-500">/</span>
          <span className="text-sm font-semibold">{title}</span>
        </div>

        {user && (
          <div className="flex items-center gap-4 text-sm">
            <Link to="/app/timeline">Timeline</Link>
            <Link to="/app/my-bookings">My Bookings</Link>
            <Link to="/app/rooms">Rooms</Link>
            {isAdmin && <Link to="/app/admin/schedule">Admin</Link>}

            <div className="relative">
              <button
                className="h-9 w-9 rounded-xl border border-zinc-200 bg-white grid place-items-center font-semibold"
                onClick={() => setOpen((v) => !v)}
              >
                {(user?.email || "U")[0].toUpperCase()}
              </button>

              {open ? (
                <>
                  <div className="fixed inset-0" onClick={() => setOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 bg-white shadow-lg p-2">
                    <div className="px-2 py-2">
                      <div className="text-sm font-semibold truncate">
                        {user?.name || "User"}
                      </div>
                      <div className="text-xs text-zinc-500 truncate">
                        {user?.email}
                      </div>
                    </div>
                    <div className="border-t border-zinc-200 pt-2">
                      <Button variant="ghost" className="w-full justify-center" onClick={doLogout}>
                        Logout
                      </Button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
