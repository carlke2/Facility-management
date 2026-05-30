import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      nav(from, { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to continue to your dashboard."
      footer={
        <span>
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-emerald-700" to="/register">
            Create one
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        {err ? <Alert type="error">{err}</Alert> : null}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <div className="space-y-2">
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {/*  Forgot password link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button className="w-full rounded-2xl py-3" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>
    </AuthShell>
  );
}
