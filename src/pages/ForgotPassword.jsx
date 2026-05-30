import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { authApi } from "../api/auth"; // ✅ FIXED

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await authApi.forgotPassword(email); // ✅ use your api
      setOk(true);
    } catch {
      setErr("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We’ll send you a reset link."
      footer={
        <span>
          <Link to="/login" className="text-emerald-700 font-semibold">
            Back to login
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        {ok && (
          <Alert type="success">
            If that email exists, a reset link has been sent.
          </Alert>
        )}

        {err && <Alert type="error">{err}</Alert>}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </AuthShell>
  );
}
