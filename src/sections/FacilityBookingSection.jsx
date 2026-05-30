import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { roomsApi } from "../api/rooms";
import { dayApi } from "../api/day";
import { bookingsApi } from "../api/bookings";
import Alert from "../components/Alert";

export default function FacilityBookingSection() {
  const { isAuthed, user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Booking Form State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    teamName: "",
    attendeeCount: 1,
    startAt: "",
    durationMinutes: 60,
    attendees: [],
  });

  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    fetchRooms();
    if (isAuthed) {
      fetchMyBookings();
    }
  }, [isAuthed]);

  const fetchRooms = async () => {
    try {
      const data = await roomsApi.list();
      setRooms(data);
    } catch (err) {
      setError("Failed to load rooms.");
    }
  };

  const fetchMyBookings = async () => {
    try {
      const data = await bookingsApi.mine();
      setMyBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    }
  };

  const checkAvailability = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await dayApi.getDay(selectedDate);
      setAvailability(data);
    } catch (err) {
      setError("Unable to load availability. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthed) {
      setError("Please sign in to continue.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        roomId: selectedRoom._id,
        teamName: bookingForm.teamName,
        attendeeCount: Number(bookingForm.attendeeCount),
        startAt: new Date(`${selectedDate}T${bookingForm.startAt}`).toISOString(),
        durationMinutes: Number(bookingForm.durationMinutes),
        attendees: bookingForm.attendees,
      };
      await bookingsApi.create(payload);
      setSuccess("Booking created successfully!");
      setShowBookingForm(false);
      checkAvailability();
      fetchMyBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please check overlaps.");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingsApi.cancel(id);
      setSuccess("Booking cancelled successfully.");
      fetchMyBookings();
      checkAvailability();
    } catch (err) {
      setError("Failed to cancel booking.");
    }
  };

  const inputClasses = "w-full bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[rgb(var(--brand))] transition-colors placeholder:text-[rgb(var(--text-muted))]";

  return (
    <section id="facility-booking" className="section-padding">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="badge-available mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--success))] mr-2 animate-pulse" />
              Available Now
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Facility & Boardroom Booking</h2>
            <p className="text-base text-[rgb(var(--text-secondary))] leading-relaxed">
              Find and book the perfect space for your team. Real-time availability, Google Calendar synchronization, and seamless coordination.
            </p>
          </div>

          {/* Date Picker Card */}
          <div className="card-premium p-5 flex flex-col sm:flex-row gap-3 items-end flex-shrink-0">
            <div>
              <label className="block text-[10px] font-bold text-[rgb(var(--text-muted))] uppercase tracking-wider mb-1.5">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={inputClasses}
              />
            </div>
            <button
              onClick={checkAvailability}
              disabled={loading}
              className="btn-primary px-5 py-2.5 text-sm whitespace-nowrap disabled:opacity-50"
            >
              {loading ? "Checking..." : "Check Availability"}
            </button>
          </div>
        </div>

        {error && <div className="mb-6"><Alert variant="error">{error}</Alert></div>}
        {success && <div className="mb-6"><Alert variant="success">{success}</Alert></div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Availability & Rooms Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-premium p-6">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[rgb(var(--success))]" />
                Available Spaces
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    className={`p-5 rounded-xl border transition-all cursor-pointer ${selectedRoom?._id === room._id
                        ? "bg-[rgb(var(--brand))/0.08] border-[rgb(var(--brand))/0.4]"
                        : "bg-[rgb(var(--bg))] border-[rgb(var(--border))] hover:border-[rgb(var(--border-light))]"
                      }`}
                    onClick={() => {
                      setSelectedRoom(room);
                      setShowBookingForm(true);
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold">{room.name}</h4>
                      <span className="text-[10px] px-2 py-1 rounded-md bg-[rgb(var(--surface-hover))] text-[rgb(var(--text-secondary))] font-medium">
                        {room.capacity} Seats
                      </span>
                    </div>
                    <p className="text-sm text-[rgb(var(--text-secondary))] mb-3">{room.location}</p>
                    <div className="flex items-center gap-2 text-xs text-[rgb(var(--success))] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--success))]" />
                      Ready to book
                    </div>
                  </div>
                ))}
              </div>

              {!rooms.length && (
                <div className="text-center py-12 text-[rgb(var(--text-muted))]">
                  <svg className="w-10 h-10 mx-auto mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                  </svg>
                  No rooms available at the moment.
                </div>
              )}
            </div>

            {/* Booking Form */}
            {showBookingForm && selectedRoom && (
              <div className="card-premium p-6 border-[rgb(var(--brand))/0.2]">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-bold">Book {selectedRoom.name}</h3>
                  <button onClick={() => setShowBookingForm(false)} className="w-8 h-8 rounded-lg bg-[rgb(var(--surface-hover))] flex items-center justify-center text-[rgb(var(--text-muted))] hover:text-white transition-colors">✕</button>
                </div>

                <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[rgb(var(--text-secondary))] mb-1.5">Team Name</label>
                    <input
                      required type="text" className={inputClasses}
                      value={bookingForm.teamName}
                      onChange={(e) => setBookingForm({ ...bookingForm, teamName: e.target.value })}
                      placeholder="e.g. Engineering"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[rgb(var(--text-secondary))] mb-1.5">Attendee Count</label>
                    <input
                      required type="number" min="1" max={selectedRoom.capacity} className={inputClasses}
                      value={bookingForm.attendeeCount}
                      onChange={(e) => setBookingForm({ ...bookingForm, attendeeCount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[rgb(var(--text-secondary))] mb-1.5">Start Time</label>
                    <input
                      required type="time" className={inputClasses}
                      value={bookingForm.startAt}
                      onChange={(e) => setBookingForm({ ...bookingForm, startAt: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[rgb(var(--text-secondary))] mb-1.5">Duration</label>
                    <select
                      className={inputClasses}
                      value={bookingForm.durationMinutes}
                      onChange={(e) => setBookingForm({ ...bookingForm, durationMinutes: e.target.value })}
                    >
                      <option value="30">30 Minutes</option>
                      <option value="60">60 Minutes</option>
                      <option value="90">90 Minutes</option>
                      <option value="120">120 Minutes</option>
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-[rgb(var(--text-secondary))] mb-1.5">Attendees (Emails, up to 5)</label>
                    <input
                      type="text" placeholder="email1@example.com, email2@example.com" className={inputClasses}
                      onChange={(e) => setBookingForm({ ...bookingForm, attendees: e.target.value.split(",").map((s) => s.trim()).filter((s) => s) })}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 pt-2">
                    <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
                      {loading ? "Creating Booking..." : "Confirm Booking"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* My Bookings */}
            <div className="card-premium p-5">
              <h3 className="text-base font-bold mb-4">My Bookings</h3>
              {!isAuthed ? (
                <div className="text-center py-6">
                  <p className="text-sm text-[rgb(var(--text-secondary))] mb-4">Sign in to view and manage your bookings.</p>
                  <a href="/login" className="btn-secondary text-xs px-4 py-2 w-full">Sign In</a>
                </div>
              ) : (
                <div className="space-y-3">
                  {myBookings.length > 0 ? (
                    myBookings.map((b) => (
                      <div key={b._id} className="p-3.5 rounded-lg bg-[rgb(var(--bg))] border border-[rgb(var(--border))]">
                        <div className="flex justify-between items-start mb-1.5">
                          <h5 className="text-sm font-bold">{b.room?.name || "Room"}</h5>
                          <button onClick={() => cancelBooking(b._id)} className="text-[rgb(var(--danger))] text-[10px] font-semibold hover:underline">Cancel</button>
                        </div>
                        <p className="text-xs text-[rgb(var(--text-secondary))]">
                          {new Date(b.startAt).toLocaleDateString()} at {new Date(b.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${b.status === "confirmed" ? "bg-[rgb(var(--success))]" : "bg-amber-500"}`} />
                          <span className="text-[10px] uppercase font-bold text-[rgb(var(--text-muted))]">{b.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-[rgb(var(--text-muted))] py-4">No bookings found.</p>
                  )}
                </div>
              )}
            </div>

            {/* Admin Tools */}
            {user?.role === "ADMIN" && (
              <div className="card-premium p-5 border-amber-500/20">
                <h3 className="text-base font-bold mb-3 text-amber-400 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  Admin Tools
                </h3>
                <div className="space-y-1">
                  {["Manage Rooms", "View Activity Logs", "Download Reports", "Connect Google Calendar"].map((item, i) => (
                    <button key={i} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[rgb(var(--surface-hover))] text-[rgb(var(--text-secondary))] hover:text-white transition-colors">{item}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Sync Card */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-[rgb(var(--brand))/0.08] to-transparent border border-[rgb(var(--brand))/0.1]">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--brand-hover))" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <h4 className="font-bold text-sm">Sync with Google Calendar</h4>
              </div>
              <p className="text-xs text-[rgb(var(--text-secondary))] leading-relaxed">
                All bookings are automatically synced with Google Calendar, ensuring no overlaps and easy access for your team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
