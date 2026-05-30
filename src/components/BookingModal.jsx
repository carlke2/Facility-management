// src/components/BookingModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
import { bookingsApi } from "../api/bookings";
import { toISODate } from "../lib/dates";

function combineDateAndTime(dateStr, timeStr) {
  const [hh, mm] = timeStr.split(":").map(Number);
  const d = new Date(dateStr + "T00:00:00");
  d.setHours(hh, mm, 0, 0);
  return d; // local date
}

function diffMinutes(start, end) {
  return Math.round((end.getTime() - start.getTime()) / 60000);
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
}

function normalizeEmail(s) {
  return String(s || "").trim().toLowerCase();
}

export default function BookingModal({
  open,
  onClose,
  rooms = [],
  preset, // { startAt, endAt } optional
  onBooked,
}) {
  const defaultRoomId = useMemo(
    () => rooms?.[0]?._id || rooms?.[0]?.id || "",
    [rooms]
  );

  const [roomId, setRoomId] = useState(defaultRoomId);
  const [teamName, setTeamName] = useState("");

  // number of people attending
  const [attendeeCount, setAttendeeCount] = useState(1);

  // attendees emails (max 2)
  const [attendees, setAttendees] = useState([]);
  const [attendeeInput, setAttendeeInput] = useState("");

  const today = toISODate(new Date());
  const [date, setDate] = useState(today);

  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // confirm cancel
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const selectedRoom = useMemo(() => {
    const id = String(roomId || "");
    return rooms.find((r) => String(r._id || r.id || "") === id) || null;
  }, [rooms, roomId]);

  const roomCap = useMemo(() => {
    const cap = Number(selectedRoom?.capacity);
    return Number.isFinite(cap) && cap > 0 ? cap : null;
  }, [selectedRoom]);

  const hasFormData =
    teamName.trim() ||
    attendeeInput.trim() ||
    (attendees && attendees.length > 0) ||
    String(attendeeCount) !== "1" ||
    date !== today ||
    startTime !== "08:00" ||
    endTime !== "10:00" ||
    String(roomId || "") !== String(defaultRoomId || "");

  useEffect(() => {
    if (!open) return;

    setErr("");
    setLoading(false);
    setTeamName("");
    setRoomId(defaultRoomId);
    setAttendeeCount(1);

    // reset attendees each open
    setAttendees([]);
    setAttendeeInput("");

    setConfirmCancelOpen(false);

    // preload from preset slot
    if (preset?.startAt && preset?.endAt) {
      const s = new Date(preset.startAt);
      const e = new Date(preset.endAt);

      setDate(toISODate(s));
      setStartTime(
        `${String(s.getHours()).padStart(2, "0")}:${String(
          s.getMinutes()
        ).padStart(2, "0")}`
      );
      setEndTime(
        `${String(e.getHours()).padStart(2, "0")}:${String(
          e.getMinutes()
        ).padStart(2, "0")}`
      );
    } else {
      setDate(today);
      setStartTime("08:00");
      setEndTime("10:00");
    }
  }, [open, preset, defaultRoomId, today]);

  if (!open) return null;

  const startPreview = combineDateAndTime(date, startTime);
  const endPreview = combineDateAndTime(date, endTime);
  const durationMinutes =
    endPreview > startPreview ? diffMinutes(startPreview, endPreview) : 0;

  const h = Math.floor(durationMinutes / 60);
  const m = durationMinutes % 60;

  function requestClose() {
    if (hasFormData) {
      setConfirmCancelOpen(true);
      return;
    }
    onClose?.();
  }

  function addAttendeeFromInput() {
    setErr("");
    const v = normalizeEmail(attendeeInput);
    if (!v) return;

    if (!isValidEmail(v)) return setErr("Enter a valid email address.");
    if (attendees.includes(v)) return setErr("That email is already added.");
    if (attendees.length >= 2) return setErr("Maximum 2 attendee emails allowed.");

    setAttendees((prev) => [...prev, v]);
    setAttendeeInput("");
  }

  function removeAttendee(emailToRemove) {
    setErr("");
    setAttendees((prev) => prev.filter((x) => x !== emailToRemove));
  }

  async function submit() {
    setErr("");

    if (!teamName.trim()) return setErr("Team name is required.");
    if (!roomId) return setErr("Please select a room.");
    if (!startTime || !endTime) return setErr("Start and end time are required.");

    const headcount = Number(attendeeCount);
    if (!Number.isFinite(headcount) || headcount < 1) {
      return setErr("People attending must be at least 1.");
    }

    if (roomCap && headcount > roomCap) {
      return setErr(
        `People attending (${headcount}) cannot exceed room capacity (${roomCap}).`
      );
    }

    const start = combineDateAndTime(date, startTime);
    const end = combineDateAndTime(date, endTime);

    if (end <= start) return setErr("End time must be after start time.");

    const dur = diffMinutes(start, end);
    if (dur < 15) return setErr("Minimum booking is 15 minutes.");

    // Auto-add typed attendee email if user didn't click Add
    const typed = normalizeEmail(attendeeInput);
    let finalAttendees = attendees;

    if (typed) {
      if (!isValidEmail(typed)) return setErr("Enter a valid email address.");
      if (!finalAttendees.includes(typed)) {
        if (finalAttendees.length >= 2) {
          return setErr("Maximum 2 attendee emails allowed.");
        }
        finalAttendees = [...finalAttendees, typed];
      }
    }

    setLoading(true);
    try {
      await bookingsApi.create({
        roomId,
        teamName: teamName.trim(),
        attendeeCount: headcount,
        attendees: finalAttendees,
        startAt: start.toISOString(),
        durationMinutes: dur,
      });

      onBooked?.();
      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={requestClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="w-full max-w-xl p-6 max-h-[88vh] overflow-y-auto pb-24">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-[rgb(var(--muted))]">Create booking</div>
              <div className="text-xl font-semibold text-[rgb(var(--text))]">
                Book a room
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
              placeholder="QA Team / Sales / Product"
              required
            />

            <div className="space-y-1">
              <label className="text-sm font-medium text-[rgb(var(--muted))]">
                Room
              </label>
              <select
                className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface2))] px-3 py-2 text-sm text-[rgb(var(--text))] outline-none transition focus:border-[rgb(var(--brand))]/40 focus:ring-2 focus:ring-[rgb(var(--brand))]/10"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              >
                {rooms.map((r) => {
                  const id = r._id || r.id;
                  return (
                    <option
                      key={id}
                      value={id}
                      className="bg-[rgb(var(--surface))] text-[rgb(var(--text))]"
                    >
                      {r.name} {r.capacity ? `(Cap ${r.capacity})` : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <Input
              label={roomCap ? `People attending (max ${roomCap})` : "People attending"}
              type="number"
              min="1"
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(e.target.value)}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgb(var(--muted))]">
                Attendees (up to 2 emails)
              </label>

              {attendees.length ? (
                <div className="flex flex-wrap gap-2">
                  {attendees.map((em) => (
                    <span
                      key={em}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white/5 px-3 py-1 text-sm text-[rgb(var(--text))]"
                    >
                      {em}
                      <button
                        type="button"
                        onClick={() => removeAttendee(em)}
                        className="text-[rgb(var(--muted))] hover:text-[rgb(var(--text))]"
                        aria-label={`Remove ${em}`}
                        title="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[rgb(var(--muted))]">
                  No attendee emails added.
                </div>
              )}

              <div className="flex gap-2">
                <input
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface2))] px-3 py-2 text-sm text-[rgb(var(--text))] outline-none transition focus:border-[rgb(var(--brand))]/40 focus:ring-2 focus:ring-[rgb(var(--brand))]/10"
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
                <Button
                  type="button"
                  onClick={addAttendeeFromInput}
                  disabled={attendees.length >= 2}
                >
                  Add
                </Button>
              </div>

              <div className="text-xs text-[rgb(var(--muted))]">
                {attendees.length}/2 added
              </div>
            </div>

            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Start time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <Input
                label="End time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface2))] p-4">
              <div className="text-xs font-semibold text-[rgb(var(--muted))]">
                Duration
              </div>
              <div className="mt-1 text-sm text-[rgb(var(--text))]">
                {durationMinutes ? (
                  <>
                    {h ? `${h}h ` : ""}
                    {m ? `${m}m` : h ? "" : "0m"}{" "}
                    <span className="text-[rgb(var(--muted))]">
                      ({durationMinutes} minutes)
                    </span>
                  </>
                ) : (
                  <span className="text-[rgb(var(--muted))]">
                    Select a valid time range
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center px-4">
          <div className="pointer-events-auto w-full max-w-xl rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]/85 backdrop-blur shadow-[0_0_25px_rgba(239,68,68,0.18)]">
            <div className="flex items-center justify-end gap-3 p-4">
              <Button
                variant="ghost"
                onClick={requestClose}
                className="text-[rgb(var(--text))] border border-[rgb(var(--border))] hover:bg-white/5 shadow-[0_0_18px_rgba(255,255,255,0.10)]"
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

        {confirmCancelOpen ? (
          <div className="fixed inset-0 z-[60]">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setConfirmCancelOpen(false)}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-sm rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface2))] p-5 shadow-xl">
                <div className="text-lg font-semibold text-[rgb(var(--text))]">
                  Cancel booking?
                </div>
                <div className="mt-2 text-sm text-[rgb(var(--muted))]">
                  Are you sure you want to cancel? Your changes will be lost.
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setConfirmCancelOpen(false)}
                    className="text-[rgb(var(--text))] border border-[rgb(var(--border))] hover:bg-white/5"
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