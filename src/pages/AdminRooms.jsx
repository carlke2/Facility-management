import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import RoomBookingModal from "../components/RoomBookingModal";
import { roomsApi } from "../api/rooms";

function safeStr(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [query, setQuery] = useState("");

  // Create form
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Booking modal (make cards clickable)
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  async function load() {
    setErr("");
    setOk("");
    setLoading(true);
    try {
      const data = await roomsApi.list();
      const arr = Array.isArray(data) ? data : data?.rooms || [];
      setRooms(Array.isArray(arr) ? arr : []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load rooms");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rooms;

    return rooms.filter((r) => {
      const hay = [r?.name, r?.location, r?.notes, r?.capacity]
        .map((x) => safeStr(x).toLowerCase())
        .join(" ");
      return hay.includes(q);
    });
  }, [rooms, query]);

  async function onCreateRoom(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    const trimmedName = name.trim();
    const capNum = Number(capacity);

    if (!trimmedName) return setErr("Room name is required.");
    if (!Number.isFinite(capNum) || capNum <= 0) return setErr("Capacity must be a valid number.");

    if (typeof roomsApi?.create !== "function") {
      return setErr("roomsApi.create is not available in ../api/rooms. Paste roomsApi if you want me to wire it correctly.");
    }

    setSaving(true);
    try {
      await roomsApi.create({
        name: trimmedName,
        capacity: capNum,
        location: location.trim(),
        notes: notes.trim(),
      });

      setOk("Room created.");
      setName("");
      setCapacity("");
      setLocation("");
      setNotes("");
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to create room");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading label="Loading rooms..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[rgb(var(--text))]">
              Manage Rooms
            </h1>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">
              Admin view of the room directory. Click a room to book it.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="w-full sm:w-[320px]">
              <Input
                label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="name, location, capacity…"
              />
            </div>

            <Button variant="ghost" onClick={load} disabled={saving}>
              Refresh
            </Button>
          </div>
        </div>

        {err ? (
          <div className="mt-3">
            <Alert type="error">{err}</Alert>
          </div>
        ) : null}

        {ok ? (
          <div className="mt-3">
            <Alert type="success">{ok}</Alert>
          </div>
        ) : null}
      </div>

      {/* Create Room (simple admin table/form) */}
      <Card className="p-5 border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-[rgb(var(--text))]">Create Room</div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">
              Add a new room with name and capacity. Optional: location and notes.
            </div>
          </div>

          <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white/5 px-3 py-1 text-xs font-semibold text-[rgb(var(--muted))]">
            ADMIN
          </span>
        </div>

        <form onSubmit={onCreateRoom} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Input label="Room Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Boardroom A" />
          </div>

          <div className="md:col-span-1">
            <Input
              label="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 10"
            />
          </div>

          <div className="md:col-span-1 flex items-end">
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Creating..." : "Create"}
            </Button>
          </div>

          <div className="md:col-span-2">
            <Input label="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. 1st Floor" />
          </div>

          <div className="md:col-span-2">
            <Input label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any extra info..." />
          </div>
        </form>
      </Card>

      {/* Rooms list (clickable -> booking modal) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <button
            key={r._id || r.id}
            type="button"
            onClick={() => {
              setSelectedRoom(r);
              setOpen(true);
            }}
            className="text-left"
          >
            <Card className="p-5 transition will-change-transform border border-[rgb(var(--border))] bg-[rgb(var(--surface))] hover:shadow-md hover:-translate-y-[1px]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-[rgb(var(--text))] truncate">
                    {r.name || "Room"}
                  </div>

                  <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                    Capacity:{" "}
                    <span className="font-semibold text-[rgb(var(--text))]">
                      {r.capacity ?? "—"}
                    </span>
                  </div>

                  {r.location ? (
                    <div className="mt-1 text-sm text-[rgb(var(--muted))] truncate">
                      Location:{" "}
                      <span className="text-[rgb(var(--text))]">{r.location}</span>
                    </div>
                  ) : null}

                  {r.notes ? (
                    <div className="mt-2 text-sm text-[rgb(var(--muted))]">
                      {r.notes}
                    </div>
                  ) : null}

                  <div className="mt-4 inline-flex items-center gap-2 text-xs text-[rgb(var(--brand))]">
                    <span className="h-2 w-2 rounded-full bg-[rgb(var(--brand))]" />
                    Click to book
                  </div>
                </div>

                <div className="shrink-0 pointer-events-none">
                  <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white/5 px-3 py-1 text-xs font-semibold text-[rgb(var(--muted))]">
                    ADMIN
                  </span>
                </div>
              </div>
            </Card>
          </button>
        ))}

        {!filtered.length ? (
          <Card className="p-6 border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
            <div className="text-sm text-[rgb(var(--muted))]">No rooms found.</div>
          </Card>
        ) : null}
      </div>

      <RoomBookingModal
        open={open}
        room={selectedRoom}
        onClose={() => setOpen(false)}
        onBooked={() => {
          setOpen(false);
        }}
      />
    </div>
  );
}
