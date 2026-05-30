import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      // go to login instead of /app
      nav("/login", { replace: true });

    } catch (e2) {
      setErr(e2?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start booking rooms instantly."
      footer={
        <span>
          Already have an account?{" "}
          <Link className="font-semibold text-emerald-700" to="/login">
            Login
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        {err ? <Alert type="error">{err}</Alert> : null}

        <Input
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Boardroom User"
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+2547XXXXXXXX"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a strong password"
          required
        />

        <Button className="w-full" size="lg" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
