"use client";

import { useState } from "react";
import Link from "next/link";
import { initialEvents } from "@/common/admin/events";
import { formatEventDate, formatEventTime, getEventStatus } from "@/common/admin/eventSchedule";
import { eventStatusClass, eventTypeClass } from "@/common/statusStyles";
import { EventPostModal } from "@/components/admin/events/EventPostModal";
import { Button } from "@/components/common/Button";
import { CurrentDateTime } from "@/components/common/CurrentDateTime";
import type { BarangayEvent } from "@/types/event";

export function Events() {
  const [events, setEvents] = useState(initialEvents);
  const [query, setQuery] = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);

  const upcomingCount = events.filter((event) => getEventStatus(event.date) === "Upcoming").length;
  const doneCount = events.filter((event) => getEventStatus(event.date) === "Done").length;

  const search = query.trim().toLowerCase();
  const visibleEvents = events.filter((event) => {
    if (!search) {
      return true;
    }

    const status = getEventStatus(event.date);
    return [
      event.id,
      event.title,
      event.description,
      event.type,
      event.audience,
      event.assignee,
      event.location,
      event.date,
      event.time,
      status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });

  function postEvent(nextEvent: Omit<BarangayEvent, "id">) {
    if (loading) {
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setEvents((current) => {
        const nextId = `EV-${String(current.length + 1).padStart(3, "0")}`;
        return [{ ...nextEvent, id: nextId }, ...current];
      });
      setLoading(false);
      setPosting(false);
    }, 800);
  }

  return (
    <div className="px-6 py-6 text-brgy-ink lg:px-10 lg:py-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-400">
          <Link href="/admin/dashboard" className="hover:text-brgy-sidebar">
            Dashboard
          </Link>
          <span className="mx-1">&gt;</span> Events
        </p>
        <CurrentDateTime />
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2c3e50]">Events</h1>
        <p className="mt-2 max-w-3xl text-base text-neutral-600">
          Post barangay events and mark what each one is for, such as relief goods or an open tournament, plus the location.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{events.length}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Total Events</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{upcomingCount}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Upcoming Events</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{doneCount}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Done Events</p>
        </article>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-[10px] bg-white px-4 py-3 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, type, assignee, or location"
            className="w-full bg-transparent text-sm text-brgy-ink outline-none placeholder:text-neutral-400"
          />
        </label>
        <Button size="md" onClick={() => setPosting(true)}>
          Post Event
        </Button>
      </div>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-white">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">EVENT ID</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">TITLE</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">FOR</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">TYPE</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">ASSIGNEE</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">LOCATION</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">DATE AND TIME</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {visibleEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-sm text-neutral-400">
                    No matching events.
                  </td>
                </tr>
              ) : null}
              {visibleEvents.map((event) => {
                const status = getEventStatus(event.date);

                return (
                  <tr key={event.id} className="border-b border-neutral-200 last:border-0">
                    <td className="px-5 py-4 font-medium">{event.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{event.title}</p>
                      <p className="mt-1 max-w-xs text-xs text-neutral-500">{event.description}</p>
                    </td>
                    <td className="px-5 py-4">{event.audience === "All" ? "All residents" : event.audience}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${eventTypeClass[event.type]}`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">{event.assignee}</td>
                    <td className="px-5 py-4">{event.location}</td>
                    <td className="px-5 py-4">
                      <p>{formatEventDate(event.date)}</p>
                      <p className="text-xs text-neutral-500">{formatEventTime(event.time)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${eventStatusClass[status]}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {posting ? (
        <EventPostModal
          loading={loading}
          onClose={() => {
            setLoading(false);
            setPosting(false);
          }}
          onPost={postEvent}
        />
      ) : null}
    </div>
  );
}
