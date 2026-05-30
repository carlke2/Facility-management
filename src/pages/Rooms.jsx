import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import RoomBookingModal from "../components/RoomBookingModal";
import { roomsApi } from "../api/rooms";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await roomsApi.list();
      const arr = Array.isArray(data) ? data : data?.rooms || [];
      setRooms(arr);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading label="Loading rooms..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[rgb(var(--text))]">
          Rooms
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">
          Tap a room to book it.
        </p>
      </div>

      {err ? <Alert type="error">{err}</Alert> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((r) => (
          <button
            key={r._id || r.id}
            onClick={() => {
              setSelectedRoom(r);
              setOpen(true);
            }}
            className="text-left group"
          >
            <Card className="p-5 transition will-change-transform border border-[rgb(var(--border))] hover:shadow-md hover:-translate-y-[1px]">
              <div className="text-lg font-semibold text-[rgb(var(--text))]">
                {r.name || "Room"}
              </div>

              <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                Capacity:{" "}
                <span className="text-[rgb(var(--text))]">
                  {r.capacity ?? "—"}
                </span>
              </div>

              <div className="mt-2 text-xs text-[rgb(var(--muted))]">
                {r.location ? `Location: ${r.location}` : "\u00A0"}
              </div>

              <div className="mt-4 inline-flex items-center gap-2 text-xs text-[rgb(var(--brand))]">
                <span className="h-2 w-2 rounded-full bg-[rgb(var(--brand))]" />
                Click to book
              </div>
            </Card>
          </button>
        ))}

        {!rooms.length ? (
          <Card className="p-5 border border-[rgb(var(--border))]">
            <div className="text-sm text-[rgb(var(--muted))]">
              No rooms found.
            </div>
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
