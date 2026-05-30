import React from "react";
import Card from "./Card";
import Button from "./Button";
import { fmtTime } from "../lib/dates";

export default function SlotList({ freeSlots = [], onPickSlot }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Free Slots (30 min)</div>
        <div className="text-xs text-gray-500">{freeSlots.length} slots</div>
      </div>

      {!freeSlots.length ? (
        <div className="text-sm text-gray-600">No free slots for this day.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {freeSlots.map((s, idx) => (
            <div
              key={`${s.startAt}-${s.endAt}-${idx}`}
              className="rounded-xl border border-gray-200 p-3 flex items-center justify-between"
            >
              <div className="text-sm">
                <span className="font-medium">{fmtTime(s.startAt)}</span> →{" "}
                {fmtTime(s.endAt)}
              </div>
              <Button onClick={() => onPickSlot(s)}>Book</Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
