// src/components/RoomBookingModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
import { bookingsApi } from "../api/bookings";
import { useAuth } from "../context/AuthContext";
import { toISODate } from "../lib/dates";

function combineDateAndTime(dateStr, timeStr) {
  const [hh, mm] = timeStr.split(":").map(Number);
  const d = new Date(dateStr + "T00:00:00");
  d.setHours(hh, mm, 0, 0);
  return d;
}

function diffMinutes(startDate, endDate) {
  return Math.round((endDate.getTime() - startDate.getTime()) / 60000);
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
}

function normalizeEmail(s) {
  return String(s || "").trim().toLowerCase();
}

export default function RoomBookingModal({ open, room, onClose, onBooked }) {
  const { user } = useAuth();

  const today = toISODate(new Date());
  const [date, setDate] = useState(today);

  const [teamName, setTeamName] = useState("");

  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");

  // headcount
  const [attendeeCount, setAttendeeCount] = useState(1);

  // up to 5 attendee emails
  const [attendees, setAttendees] = useState([]);
  const [attendeeInput, setAttendeeInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // confirm cancel modal
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    setErr("");
    setLoading(false);

    setDate(today);
    setTeamName("");

    setStartTime("08:00");
    setEndTime("10:00");

    setAttendeeCount(1);

    const initial = user?.email ? [normalizeEmail(user.email)] : [];
    setAttendees(initial);
    setAttendeeInput("");

    setConfirmCancelOpen(false);
  }, [open, user, today]);

  const startPreview = useMemo(() => combineDateAndTime(date, startTime), [date, startTime]);
  const endPreview = useMemo(() => combineDateAndTime(date, endTime), [date, endTime]);
  const dur = endPreview > startPreview ? diffMinutes(startPreview, endPreview) : 0;
  const durH = Math.floor(dur / 60);
  const durM = dur % 60;

  const hasFormData =
    teamName.trim() ||
    attendeeInput.trim() ||
    (attendees && attendees.length > 0) ||
    String(attendeeCount) !== "1" ||
    startTime !== "08:00" ||
    endTime !== "10:00" ||
    date !== today;

  if (!open || !room) return null;

  function addAttendeeFromInput() {
    setErr("");
    const v = normalizeEmail(attendeeInput);
    if (!v) return;

    if (!isValidEmail(v)) return setErr("Enter a valid email address.");
    if (attendees.includes(v)) return setErr("That email is already added.");
    if (attendees.length >= 5) return setErr("Maximum 5 attendee emails allowed.");

    setAttendees((prev) => [...prev, v]);
    setAttendeeInput("");
  }

  function removeAttendee(emailToRemove) {
    setErr("");
    setAttendees((prev) => prev.filter((x) => x !== emailToRemove));
  }

  function requestClose() {
    // If user has typed anything, ask confirmation
    if (hasFormData) {
      setConfirmCancelOpen(true);
      return;
    }
    onClose?.();
  }

  async function submit() {
    setErr("");

    if (!teamName.trim()) return setErr("Team name is required.");
    if (!startTime || !endTime) return setErr("Start and end time are required.");

    const start = combineDateAndTime(date, startTime);
    const end = combineDateAndTime(date, endTime);

    if (end <= start) return setErr("End time must be after start time.");

    const durationMinutes = diffMinutes(start, end);
    if (durationMinutes < 30) return setErr("Minimum booking is 30 minutes.");

    const headcount = Number(attendeeCount);
    if (!Number.isFinite(headcount) || headcount < 1) return setErr("People must be at least 1.");

    const cap = Number(room.capacity ?? 0);
    if (cap && headcount > cap) {
      return setErr(`People (${headcount}) cannot exceed room capacity (${cap}).`);
    }

    // If user typed an email but didn’t press add, auto-add it (if valid)
    const typed = normalizeEmail(attendeeInput);
    let finalAttendees = attendees;
    if (typed) {
      if (!isValidEmail(typed)) return setErr("Enter a valid email address.");
      if (!finalAttendees.includes(typed)) {
        if (finalAttendees.length >= 5) return setErr("Maximum 5 attendee emails allowed.");
        finalAttendees = [...finalAttendees, typed];
      }
    }

    const payload = {
      roomId: room._id || room.id,
      teamName: teamName.trim(),
      attendeeCount: headcount,
      attendees: finalAttendees,
      startAt: start.toISOString(),
      durationMinutes,
    };

    setLoading(true);
    try {
      await bookingsApi.create(payload);
      onBooked?.();
      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to book room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={requestClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        {/* reserve space for floating action bar so content never hides behind it */}
        <Card className="w-full max-w-lg p-6 max-h-[88vh] overflow-y-auto pb-24">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-zinc-400">Booking</div>
              <div className="text-xl font-semibold text-white">{room.name}</div>
              <div className="mt-1 text-sm text-zinc-400">
                Capacity: {room.capacity ?? "—"} {room.location ? `• ${room.location}` : ""}
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={requestClose}>
              Close
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            {err ? <Alert type="error">{err}</Alert> : null}

            <Input
              label="Team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. QA Team / Sales / Product"
              required
            />

            <Input
              label={`People (max ${room.capacity ?? "—"})`}
              type="number"
              min="1"
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(e.target.value)}
              required
            />

            {/* Attendees */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Attendees (up to 5 emails)</label>

              {attendees.length ? (
                <div className="flex flex-wrap gap-2">
                  {attendees.map((em) => (
                    <span
                      key={em}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white"
                    >
                      {em}
                      <button
                        type="button"
                        onClick={() => removeAttendee(em)}
                        className="text-zinc-300 hover:text-white"
                        aria-label={`Remove ${em}`}
                        title="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-zinc-500">No attendee emails added.</div>
              )}

              <div className="flex gap-2">
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-600"
                  type="email"
                  value={attendeeInput}
                  onChange={(e) => setAttendeeInput(e.target.value)}
                  placeholder="name@company.com"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAttendeeFromInput();
                    }
                  }}
                />
                <Button type="button" onClick={addAttendeeFromInput} disabled={attendees.length >= 5}>
                  Add
                </Button>
              </div>

              <div className="text-xs text-zinc-500">{attendees.length}/5 added</div>
            </div>

            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Start time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <Input
                label="End time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-3">
              <div className="text-xs font-semibold text-zinc-300">Duration</div>
              <div className="mt-1 text-sm text-white">
                {dur ? (
                  <>
                    {durH ? `${durH} hour${durH > 1 ? "s" : ""}` : ""}
                    {durH && durM ? " " : ""}
                    {durM ? `${durM} min` : durH ? "" : "0 min"}
                    <span className="text-zinc-400"> ({dur} minutes)</span>
                  </>
                ) : (
                  <span className="text-zinc-500">Select a valid time range</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Floating action bar (always visible, glows, never goes behind content) */}
        <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center px-4">
          <div className="pointer-events-auto w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900/75 backdrop-blur shadow-[0_0_25px_rgba(239,68,68,0.18)]">
            <div className="flex items-center justify-end gap-3 p-4">
              <Button
                variant="ghost"
                onClick={requestClose}
                className="text-white border border-slate-600 hover:bg-slate-800 shadow-[0_0_18px_rgba(255,255,255,0.10)]"
              >
                Cancel
              </Button>

              <Button
                onClick={submit}
                disabled={loading}
                className="shadow-[0_0_22px_rgba(239,68,68,0.35)]"
              >
                {loading ? "Booking..." : "Book"}
              </Button>
            </div>
          </div>
        </div>

        {/* Cancel confirmation dialog */}
        {confirmCancelOpen ? (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmCancelOpen(false)} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
                <div className="text-lg font-semibold text-white">Cancel booking?</div>
                <div className="mt-2 text-sm text-zinc-300">
                  Are you sure you want to cancel? Your changes will be lost.
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setConfirmCancelOpen(false)}
                    className="text-white border border-slate-600 hover:bg-slate-800"
                  >
                    Continue editing
                  </Button>
                  <Button
                    onClick={() => {
                      setConfirmCancelOpen(false);
                      onClose?.();
                    }}
                    className="shadow-[0_0_22px_rgba(239,68,68,0.35)]"
                  >
                    Yes, cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
