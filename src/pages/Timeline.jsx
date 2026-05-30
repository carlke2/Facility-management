import React, { useEffect, useMemo, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import BookingModal from "../components/BookingModal";
import { dayApi } from "../api/day";
import { roomsApi } from "../api/rooms";
import { toISODate } from "../lib/dates";
import { useAuth } from "../context/AuthContext";

/**
 * POLICY HOURS (Kenya)
 */
const TZ = "Africa/Nairobi";
const TZ_LABEL = "EAT";
const WORK_START = "08:00";
const WORK_END = "17:00";
const SLOT_MINUTES = 30;

/** UI paging to avoid long scroll */
const PAGE_SIZE = 10;

/* -------------------- time helpers -------------------- */

function fmtHHMM(hhmm) {
  if (!hhmm || !/^\d{2}:\d{2}$/.test(String(hhmm))) return "—";
  const [h, m] = String(hhmm).split(":").map(Number);
  const hour12 = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

function fmtTimeEAT(isoOrMs) {
  const d = typeof isoOrMs === "number" ? new Date(isoOrMs) : new Date(isoOrMs);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  }).format(d);
}

function dayLabel(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat([], {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: TZ,
  }).format(d);
}

/**
 * EAT has no DST. Convert "date + HH:MM (EAT)" into a UTC instant in ms.
 * EAT = UTC+3 => UTC instant = local(EAT) - 3h.
 */
function eatInstantMs(dateStr, hhmm) {
  const [hh, mm] = hhmm.split(":").map(Number);
  const utcMidnight = new Date(`${dateStr}T00:00:00.000Z`);
  utcMidnight.setUTCHours(hh - 3, mm, 0, 0);
  return utcMidnight.getTime();
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

function minutesBetween(aIso, bIso) {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(0, Math.round((b - a) / 60000));
}

function fmtDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function sumMinutes(items) {
  return items.reduce((acc, it) => acc + minutesBetween(it.startAt, it.endAt), 0);
}

/* -------------------- UI bits -------------------- */

function Badge({ tone = "neutral", children }) {
  const tones = {
    neutral: "border-[rgb(var(--border))] bg-white/5 text-[rgb(var(--text))]",
    booked: "border-red-500/30 bg-red-500/10 text-red-200",
    free: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        tones[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

/* -------------------- component -------------------- */

export default function Timeline() {
  const { user } = useAuth();
  const isAdmin = String(user?.role || "").toUpperCase() === "ADMIN";

  const today = useMemo(() => toISODate(new Date()), []);
  const [date, setDate] = useState(today);

  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [err, setErr] = useState("");

  const [day, setDay] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [presetSlot, setPresetSlot] = useState(null);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  async function loadRooms() {
    setRoomsLoading(true);
    try {
      const data = await roomsApi.list();
      setRooms(Array.isArray(data) ? data : data?.rooms || []);
    } finally {
      setRoomsLoading(false);
    }
  }

  async function loadDay() {
    setErr("");
    setLoading(true);
    try {
      const data = await dayApi.getDay(date);
      setDay(data);
      setVisibleCount(PAGE_SIZE);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load schedule");
      setDay(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    loadDay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const bookedEvents = useMemo(() => {
    const items = (day?.booked || []).slice();
    items.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
    return items;
  }, [day]);

  /**
   * ✅ PROPER FIX:
   * Build timeline slots locally for 08:00–17:00 EAT using 30-min blocks,
   * then mark each block as BOOKED if it overlaps any calendar event.
   */
  const schedule = useMemo(() => {
    const startMs = eatInstantMs(date, WORK_START);
    const endMs = eatInstantMs(date, WORK_END);
    const step = SLOT_MINUTES * 60 * 1000;

    const eventsMs = bookedEvents
      .map((e) => {
        const s = new Date(e.startAt).getTime();
        const en = new Date(e.endAt).getTime();
        return {
          ...e,
          _s: s,
          _e: en,
        };
      })
      .filter((e) => Number.isFinite(e._s) && Number.isFinite(e._e));

    const blocks = [];
    for (let t = startMs; t < endMs; t += step) {
      const blockStart = t;
      const blockEnd = Math.min(t + step, endMs);

      const conflict = eventsMs.find((ev) => overlaps(blockStart, blockEnd, ev._s, ev._e));

      if (conflict) {
        blocks.push({
          type: "booked",
          title: conflict.title || "Meeting",
          startAt: new Date(blockStart).toISOString(),
          endAt: new Date(blockEnd).toISOString(),
          meetingLink: conflict.meetingLink || null,
          googleEventId: conflict.googleEventId || null,
        });
      } else {
        blocks.push({
          type: "free",
          startAt: new Date(blockStart).toISOString(),
          endAt: new Date(blockEnd).toISOString(),
        });
      }
    }

    return blocks;
  }, [date, bookedEvents]);

  const bookedMinutes = sumMinutes(bookedEvents);
  const freeMinutes = sumMinutes(schedule.filter((s) => s.type === "free"));

  const visibleSchedule = schedule.slice(0, visibleCount);
  const hasMore = visibleCount < schedule.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-[rgb(var(--text))]">Schedule</h1>
            {isAdmin ? (
              <span className="rounded-full bg-white/5 border border-[rgb(var(--border))] text-[rgb(var(--text))] text-xs font-semibold px-2 py-1">
                ADMIN
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            {dayLabel(date)} — green slots are bookable, red blocks are busy.
          </p>
          <p className="mt-1 text-xs text-[rgb(var(--muted))]">
            Times shown in <span className="font-semibold">{TZ_LABEL}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="w-56">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/5 border-[rgb(var(--border))] text-[rgb(var(--text))]"
            />
          </div>

          <Button variant="ghost" className="h-[42px]" onClick={loadDay}>
            Refresh
          </Button>

          <button
            className="h-[42px] rounded-xl px-4 font-semibold border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/15 transition"
            onClick={() => {
              setPresetSlot(null);
              setModalOpen(true);
            }}
          >
            Book custom
          </button>
        </div>
      </div>

      {err ? <Alert type="error">{err}</Alert> : null}

      {loading || roomsLoading ? (
        <Loading label="Loading schedule..." />
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-soft">
              <div className="text-sm text-[rgb(var(--muted))]">Work window</div>
              <div className="mt-1 text-lg font-semibold text-[rgb(var(--text))]">
                {fmtHHMM(WORK_START)} – {fmtHHMM(WORK_END)} ({TZ_LABEL})
              </div>
              <div className="mt-2 text-xs text-[rgb(var(--muted))]">Configured hours</div>
            </div>

            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-soft">
              <div className="text-sm text-[rgb(var(--muted))]">Booked</div>
              <div className="mt-1 text-lg font-semibold text-[rgb(var(--text))]">
                {fmtDuration(bookedMinutes)}
              </div>
              <div className="mt-2 text-xs text-[rgb(var(--muted))]">{bookedEvents.length} meeting(s)</div>
            </div>

            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-soft">
              <div className="text-sm text-[rgb(var(--muted))]">Free</div>
              <div className="mt-1 text-lg font-semibold text-emerald-200">{fmtDuration(freeMinutes)}</div>
              <div className="mt-2 text-xs text-[rgb(var(--muted))]">
                {schedule.filter((s) => s.type === "free").length} slot(s)
              </div>
            </div>

            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-soft">
              <div className="text-sm text-[rgb(var(--muted))]">Rooms</div>
              <div className="mt-1 text-lg font-semibold text-[rgb(var(--text))]">{rooms.length}</div>
              <div className="mt-2 text-xs text-[rgb(var(--muted))]">Directory (not schedule-based)</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-[rgb(var(--muted))]">Timeline</div>
                <div className="text-lg font-semibold text-[rgb(var(--text))]">Booked & available blocks</div>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs text-[rgb(var(--muted))]">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Booked
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Free
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {visibleSchedule.map((it, idx) => {
                const dur = minutesBetween(it.startAt, it.endAt);
                const start = fmtTimeEAT(it.startAt);
                const end = fmtTimeEAT(it.endAt);

                if (it.type === "booked") {
                  return (
                    <div
                      key={`b-${idx}`}
                      className="group relative overflow-hidden rounded-2xl border border-red-500/25 bg-red-500/10 p-4 hover:bg-red-500/15 transition"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/70" />
                      <div className="flex items-start justify-between gap-4 pl-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge tone="booked">BOOKED</Badge>
                            <Badge tone="neutral">{fmtDuration(dur)}</Badge>
                          </div>

                          <div className="mt-2 text-base font-semibold text-[rgb(var(--text))] truncate">
                            {it.title || "Meeting"}
                          </div>

                          <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                            {start} – {end}
                          </div>

                          <div className="mt-2 text-xs text-[rgb(var(--muted))]">
                            {it.meetingLink ? "Meeting link available" : "No meeting link"}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-xs font-semibold text-[rgb(var(--muted))]">Busy</div>
                          <div className="mt-1 text-xs text-[rgb(var(--muted))]">
                            {it.googleEventId ? "Google Calendar" : "Internal"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`f-${idx}`}
                    className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 hover:bg-emerald-500/15 transition"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/70" />
                    <div className="flex items-start justify-between gap-4 pl-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge tone="free">FREE</Badge>
                          <Badge tone="neutral">{fmtDuration(dur)}</Badge>
                        </div>

                        <div className="mt-2 text-base font-semibold text-[rgb(var(--text))]">
                          {start} – {end}
                        </div>

                        <div className="mt-1 text-sm text-[rgb(var(--muted))]">Available to book</div>

                        <div className="mt-2 text-xs text-emerald-200/80">
                          Tip: click “Book” to prefill start/end times.
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setPresetSlot({ startAt: it.startAt, endAt: it.endAt });
                            setModalOpen(true);
                          }}
                        >
                          Book
                        </Button>

                        <span className="text-[11px] text-[rgb(var(--muted))]">Min duration: 30m</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!schedule.length ? (
                <div className="rounded-2xl border border-dashed border-[rgb(var(--border))] p-6 text-sm text-[rgb(var(--muted))]">
                  No schedule data for this date.
                </div>
              ) : null}

              {hasMore ? (
                <div className="pt-3 flex justify-center">
                  <Button variant="ghost" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                    Show {Math.min(PAGE_SIZE, schedule.length - visibleCount)} more
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          <BookingModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            rooms={rooms}
            preset={presetSlot}
            onBooked={async () => {
              await loadDay();
            }}
          />
        </>
      )}
    </div>
  );
}
