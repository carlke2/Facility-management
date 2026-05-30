import React, { useEffect, useMemo, useState } from "react";
import { dayApi } from "../api/day";
import { bookingsApi } from "../api/bookings";

import Card from "../components/Card";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function time(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ✅ ISO range for the selected date (local midnight -> next midnight)
function isoRangeForDate(dateStr) {
  const startLocal = new Date(`${dateStr}T00:00:00`);
  const endLocal = new Date(startLocal.getTime() + 24 * 60 * 60 * 1000);
  return { fromISO: startLocal.toISOString(), toISO: endLocal.toISOString() };
}

export default function AdminSchedule() {
  const [date, setDate] = useState(today());

  // day data
  const [dayData, setDayData] = useState(null);

  // ✅ REAL bookings from MongoDB (admin endpoint)
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [cancelling, setCancelling] = useState("");
  const [exporting, setExporting] = useState("");

  // dialog state
  const [viewing, setViewing] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  async function load(selectedDate) {
    const { fromISO, toISO } = isoRangeForDate(selectedDate);

    setLoading(true);
    setError("");
    try {
      // Load day schedule metadata
      const dayRes = await dayApi.getDay(selectedDate);
      setDayData(dayRes);

      // ✅ Load real bookings (this drives table, cancel, view, report consistency)
      const list = await bookingsApi.listAdmin(fromISO, toISO);
      setBookings(list);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(date);
    // eslint-disable-next-line
  }, []);

  const bookedSorted = useMemo(() => {
    return [...bookings].sort(
      (a, b) => new Date(a.startAt) - new Date(b.startAt)
    );
  }, [bookings]);

  async function cancel(id) {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      setCancelling(id);
      await bookingsApi.cancel(id);
      await load(date);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling("");
    }
  }

  async function view(id) {
    try {
      setViewLoading(true);
      setError("");
      const booking = await bookingsApi.getOneAdmin(id);
      setViewing(booking);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load booking details");
    } finally {
      setViewLoading(false);
    }
  }

  async function exportPdf() {
    const { fromISO, toISO } = isoRangeForDate(date);
    try {
      setExporting("pdf");
      setError("");
      await bookingsApi.exportPdf(fromISO, toISO);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to export PDF report");
    } finally {
      setExporting("");
    }
  }

  async function exportExcel() {
    const { fromISO, toISO } = isoRangeForDate(date);
    try {
      setExporting("xlsx");
      setError("");
      await bookingsApi.exportExcel(fromISO, toISO);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to export Excel report");
    } finally {
      setExporting("");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4 text-[rgb(var(--text))]">
        Admin Schedule
      </h1>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Reports (PDF first) */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={exportPdf} disabled={exporting === "pdf"}>
          {exporting === "pdf" ? "Exporting..." : "Export PDF"}
        </Button>

        <Button
          variant="ghost"
          onClick={exportExcel}
          disabled={exporting === "xlsx"}
        >
          {exporting === "xlsx" ? "Exporting..." : "Export Excel"}
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[rgb(var(--muted))]">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-[220px] border border-[rgb(var(--border))] bg-[rgb(var(--surface2))] text-[rgb(var(--text))] rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]/40"
            style={{ colorScheme: "dark" }}
          />
        </div>

        <Button onClick={() => load(date)}>Load</Button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-3 mb-6">
            <Card>Booked: {bookedSorted.length}</Card>
            <Card>Free: {dayData?.freeSlots?.length || 0}</Card>
            <Card>
              Work:{" "}
              {dayData?.workWindow
                ? `${time(dayData.workWindow.startAt)} - ${time(
                    dayData.workWindow.endAt
                  )}`
                : "—"}
            </Card>
          </div>

          <Card>
            {bookedSorted.length === 0 ? (
              <p className="text-[rgb(var(--muted))]">No bookings</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-[rgb(var(--muted))] border-b border-[rgb(var(--border))]">
                    <tr>
                      <th className="py-2 pr-3">Time</th>
                      <th className="py-2 pr-3">Team</th>
                      <th className="py-2 pr-3">People</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>

                  <tbody className="text-[rgb(var(--text))]">
                    {bookedSorted.map((b) => (
                      <tr
                        key={b._id}
                        className="border-b border-[rgb(var(--border))]"
                      >
                        <td className="py-2 pr-3 whitespace-nowrap">
                          {time(b.startAt)} - {time(b.endAt)}
                        </td>

                        <td className="pr-3">{b.teamName}</td>

                        <td className="pr-3">{b.attendeeCount ?? "—"}</td>

                        <td className="pr-3">
                          <span className="text-[rgb(var(--muted))]">
                            {b.status || "CONFIRMED"}
                          </span>
                        </td>

                        <td className="py-2">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" onClick={() => view(b._id)}>
                              View
                            </Button>

                            <Button
                              size="sm"
                              variant="danger"
                              disabled={cancelling === b._id}
                              onClick={() => cancel(b._id)}
                            >
                              {cancelling === b._id ? "..." : "Cancel"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {/* View Dialog */}
      {viewing && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {viewLoading ? (
              <Loading />
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4 text-[rgb(var(--text))]">
                  Booking Details
                </h2>

                <div className="space-y-2 text-sm text-[rgb(var(--text))]">
                  <p>
                    <b className="text-[rgb(var(--muted))]">Team:</b>{" "}
                    {viewing.teamName || "—"}
                  </p>
                  <p>
                    <b className="text-[rgb(var(--muted))]">Meeting:</b>{" "}
                    {viewing.meetingTitle || "—"}
                  </p>
                  <p>
                    <b className="text-[rgb(var(--muted))]">Time:</b>{" "}
                    {time(viewing.startAt)} - {time(viewing.endAt)}
                  </p>
                  <p>
                    <b className="text-[rgb(var(--muted))]">Status:</b>{" "}
                    {viewing.status || "CONFIRMED"}
                  </p>

                  <p>
                    <b className="text-[rgb(var(--muted))]">Room:</b>{" "}
                    {viewing.roomId?.name || "—"}
                  </p>
                  <p>
                    <b className="text-[rgb(var(--muted))]">Capacity:</b>{" "}
                    {viewing.roomId?.capacity ?? "—"}
                  </p>

                  <p>
                    <b className="text-[rgb(var(--muted))]">People:</b>{" "}
                    {viewing.attendeeCount ?? "—"}
                  </p>

                  <p className="break-words">
                    <b className="text-[rgb(var(--muted))]">Email:</b>{" "}
                    {viewing.userId?.email || "—"}
                  </p>
                </div>

                <div className="mt-6 text-right">
                  <Button variant="ghost" onClick={() => setViewing(null)}>
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
