import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../api/admin";

function safeString(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return safeString(value);
  return d.toLocaleString();
}

export default function AdminActivity() {
  const PAGE_SIZE = 50;

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);

  const skip = page * PAGE_SIZE;

  async function load() {
    setLoading(true);
    setErr("");

    try {
      const res = await adminApi.activity({ limit: PAGE_SIZE, skip });

      if (!res?.ok) throw new Error(res?.message || "Failed");

      setTotal(Number(res.total || 0));
      setItems(Array.isArray(res.items) ? res.items : []);
    } catch (e) {
      setErr(e.message || "Failed to load activity logs");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [skip]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return items;

    return items.filter((it) =>
      JSON.stringify(it).toLowerCase().includes(q)
    );
  }, [items, query]);

  const maxPage = Math.max(0, Math.ceil(total / PAGE_SIZE) - 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[rgb(var(--text))]">
              Activity Logs
            </h1>
            <p className="text-sm text-[rgb(var(--muted))]">
              Admin audit trail (bookings, rooms, and system actions)
            </p>
          </div>

          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search action, user, IP, description..."
              className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface2))] text-[rgb(var(--text))] px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {err && (
        <div className="text-red-400 text-sm">{err}</div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-[rgb(var(--surface2))]">
            <tr className="text-[rgb(var(--text))]">
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">User email</th>
              <th className="px-4 py-3 text-left">IP</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((it, i) => (
              <tr
                key={i}
                className="border-t border-[rgb(var(--border))]"
              >
                <td className="px-4 py-3 text-[rgb(var(--muted))]">
                  {formatDateTime(it.createdAt)}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-[rgb(var(--brand))]/15 text-[rgb(var(--text))] px-3 py-1 text-xs border border-[rgb(var(--brand))]/30">
                    {it.action}
                  </span>
                </td>

                <td className="px-4 py-3 text-[rgb(var(--text))]">
                  {it.description}
                </td>

                <td className="px-4 py-3 text-[rgb(var(--muted))]">
                  {it.actorEmail || "-"}
                </td>

                <td className="px-4 py-3 text-[rgb(var(--muted))]">
                  {it.ip || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}