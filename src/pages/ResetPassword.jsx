import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { authApi } from "../api/auth"; // ✅ FIXED

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await authApi.resetPassword(token, password); // ✅ correct usage
      navigate("/login", { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter your new password."
      footer={<Link to="/login">Back to login</Link>}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        {err && <Alert type="error">{err}</Alert>}

        <Input
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button className="w-full" disabled={loading || !token}>
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </AuthShell>
  );
}
