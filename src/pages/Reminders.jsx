import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import Button from "../components/Button";
import { remindersApi } from "../api/reminders";

function fmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtOnlyTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function labelType(t) {
  const map = {
    STARTS_20: "Starts in 20 minutes",
    JOIN_NOW: "Join now",
    ENDING_10: "Ending in 10 minutes",
  };
  return map[t] || t || "Reminder";
}

function StatusPill({ status }) {
  const s = String(status || "PENDING").toUpperCase();

  const cls =
    s === "SENT"
      ? "bg-white/5 text-[rgb(var(--text))] border-[rgb(var(--border))]"
      : s === "CANCELLED"
      ? "bg-white/5 text-[rgb(var(--text))] border-[rgb(var(--border))]"
      : "bg-[rgb(var(--brand))]/18 text-[rgb(var(--text))] border-[rgb(var(--brand))]/30";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {s}
    </span>
  );
}

export default function Reminders() {
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Pagination (client-side, no new APIs)
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = showAll
        ? await remindersApi.mine()
        : await remindersApi.mineUpcoming();
      const arr = Array.isArray(data) ? data : data?.reminders || [];
      setItems(Array.isArray(arr) ? arr : []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load reminders");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // reset page when switching Upcoming/All (or reloading)
    setPage(1);
    load();
    // eslint-disable-next-line
  }, [showAll]);

  const pendingCount = useMemo(
    () => items.filter((r) => String(r.status).toUpperCase() === "PENDING").length,
    [items]
  );

  const totalPages = useMemo(() => {
    const n = Math.ceil((items?.length || 0) / PAGE_SIZE);
    return Math.max(1, n);
  }, [items]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  function clampPage(next) {
    const p = Math.min(Math.max(1, next), totalPages);
    setPage(p);
  }

  if (loading) return <Loading label="Loading reminders..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[rgb(var(--text))]">Reminders</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            {showAll
              ? "All reminders history."
              : "Upcoming reminders that will be sent automatically."}
          </p>
          <p className="mt-1 text-xs text-[rgb(var(--muted))]">
            Pending: {pendingCount} • Total: {items.length}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant={showAll ? "ghost" : "primary"} onClick={() => setShowAll(false)}>
            Upcoming
          </Button>
          <Button variant={showAll ? "primary" : "ghost"} onClick={() => setShowAll(true)}>
            All
          </Button>
        </div>
      </div>

      {err ? <Alert type="error">{err}</Alert> : null}

      {/* Pagination controls (top) */}
      {items.length ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-[rgb(var(--muted))]">
            Showing{" "}
            <span className="text-[rgb(var(--text))] font-semibold">
              {(page - 1) * PAGE_SIZE + 1}
            </span>
            {" – "}
            <span className="text-[rgb(var(--text))] font-semibold">
              {Math.min(page * PAGE_SIZE, items.length)}
            </span>{" "}
            of{" "}
            <span className="text-[rgb(var(--text))] font-semibold">
              {items.length}
            </span>
          </div>

          <div className="flex items-center gap-2 justify-start sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => clampPage(page - 1)}
              disabled={page <= 1}
            >
              Prev
            </Button>

            <div className="text-sm text-[rgb(var(--muted))]">
              Page{" "}
              <span className="text-[rgb(var(--text))] font-semibold">{page}</span>{" "}
              /{" "}
              <span className="text-[rgb(var(--text))] font-semibold">
                {totalPages}
              </span>
            </div>

            <Button
              variant="ghost"
              onClick={() => clampPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {!items.length ? (
        <Card className="p-6">
          <div className="text-sm font-semibold text-[rgb(var(--text))]">No reminders</div>
          <div className="mt-1 text-sm text-[rgb(var(--muted))]">
            Reminders are created automatically when you book a room.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pagedItems.map((r) => {
            const b = r.bookingId; // populated booking
            const roomName = b?.roomId?.name || "—";
            const roomCap = b?.roomId?.capacity ?? "—";
            const people = b?.attendeeCount ?? "—";

            return (
              <Card key={r._id || r.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[rgb(var(--text))] truncate">
                      {labelType(r.type)}
                    </div>
                    <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                      Scheduled:{" "}
                      <span className="font-medium text-[rgb(var(--text))]">
                        {fmtTime(r.scheduledAt)}
                      </span>
                    </div>
                  </div>
                  <StatusPill status={r.status} />
                </div>

                <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface2))] p-4 text-sm">
                  <div className="font-semibold text-[rgb(var(--text))]">
                    {b?.teamName || "Team —"}
                    {b?.meetingTitle ? (
                      <span className="text-[rgb(var(--muted))]"> • {b.meetingTitle}</span>
                    ) : null}
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[rgb(var(--text))]">
                    <div>
                      <span className="text-[rgb(var(--muted))]">Booking time:</span>{" "}
                      {fmtOnlyTime(b?.startAt)} – {fmtOnlyTime(b?.endAt)}
                    </div>
                    <div>
                      <span className="text-[rgb(var(--muted))]">Room:</span> {roomName}{" "}
                      <span className="text-[rgb(var(--muted))]">(Cap {roomCap})</span>
                    </div>
                    <div>
                      <span className="text-[rgb(var(--muted))]">People:</span> {people}
                    </div>
                    <div>
                      <span className="text-[rgb(var(--muted))]">Booking status:</span>{" "}
                      {String(b?.status || "CONFIRMED").toUpperCase()}
                    </div>
                  </div>
                </div>

                {r.sentAt ? (
                  <div className="mt-3 text-xs text-[rgb(var(--muted))]">
                    Sent at: {fmtTime(r.sentAt)}
                  </div>
                ) : null}
              </Card>
            );
          })}

          {/* Pagination controls (bottom) */}
          {items.length > PAGE_SIZE ? (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => clampPage(page - 1)}
                disabled={page <= 1}
              >
                Prev
              </Button>

              <div className="text-sm text-[rgb(var(--muted))]">
                Page{" "}
                <span className="text-[rgb(var(--text))] font-semibold">{page}</span>{" "}
                /{" "}
                <span className="text-[rgb(var(--text))] font-semibold">
                  {totalPages}
                </span>
              </div>

              <Button
                variant="ghost"
                onClick={() => clampPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
