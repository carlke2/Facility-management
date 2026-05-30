import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[rgb(var(--text))]">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-[rgb(var(--muted))]">
          Quick actions and overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Day View */}
        <Card className="p-5 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] hover:shadow-md transition">
          <div className="text-sm text-[rgb(var(--muted))]">
            Day View
          </div>

          <div className="mt-1 text-lg font-semibold text-[rgb(var(--text))]">
            Free slots
          </div>

          <div className="mt-3">
            <Link to="/app/timeline">
              <Button className="rounded-2xl">
                Open
              </Button>
            </Link>
          </div>
        </Card>

        {/* Bookings */}
        <Card className="p-5 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] hover:shadow-md transition">
          <div className="text-sm text-[rgb(var(--muted))]">
            Bookings
          </div>

          <div className="mt-1 text-lg font-semibold text-[rgb(var(--text))]">
            My bookings
          </div>

          <div className="mt-3">
            <Link to="/app/bookings">
              <Button className="rounded-2xl">
                View
              </Button>
            </Link>
          </div>
        </Card>

        {/* Rooms */}
        <Card className="p-5 border border-[rgb(var(--border))] bg-[rgb(var(--surface))] hover:shadow-md transition">
          <div className="text-sm text-[rgb(var(--muted))]">
            Rooms
          </div>

          <div className="mt-1 text-lg font-semibold text-[rgb(var(--text))]">
            Available rooms
          </div>

          <div className="mt-3">
            <Link to="/app/rooms">
              <Button className="rounded-2xl">
                Browse
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
