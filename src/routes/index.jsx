// src/routes/index.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import AppShell from "../components/AppShell";

import Dashboard from "../pages/Dashboard";
import Timeline from "../pages/Timeline";
import MyBookings from "../pages/MyBookings";
import Rooms from "../pages/Rooms";
import Reminders from "../pages/Reminders";
import AdminRooms from "../pages/AdminRooms";
import AdminSchedule from "../pages/AdminSchedule";
import AdminActivity from "../pages/AdminActivity"; // ✅ add this

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected App */}
      <Route path="/app" element={<ProtectedRoute />}>
        {/* App layout */}
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="reminders" element={<Reminders />} />

          {/* Admin */}
          <Route path="admin" element={<AdminRoute />}>
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="activity" element={<AdminActivity />} /> {/* ✅ add this */}
          </Route>

          {/* App fallback */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Route>

      {/* Global fallback */}
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}
