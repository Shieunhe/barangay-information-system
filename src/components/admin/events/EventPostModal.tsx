"use client";

import { useState, type FormEvent } from "react";
import { eventAudiences } from "@/common/admin/eventAudiences";
import { eventTypes } from "@/common/admin/eventTypes";
import { Button } from "@/components/common/Button";
import type { BarangayEvent, EventAudience, EventType } from "@/types/event";

function RequiredLabel({ children }: { children: string }) {
  return (
    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">
      {children} <span className="text-red-500">*</span>
    </span>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <RequiredLabel>{label}</RequiredLabel>
      <input
        type="text"
        required
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-[#c5d4f0] bg-white px-3 py-2.5 text-sm text-brgy-ink outline-none"
      />
    </label>
  );
}

export function EventPostModal({
  loading,
  onClose,
  onPost,
}: {
  loading: boolean;
  onClose: () => void;
  onPost: (event: Omit<BarangayEvent, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<EventType | "">("");
  const [audience, setAudience] = useState<EventAudience | "">("");
  const [assignee, setAssignee] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  function handlePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTitle = title.trim();
    const nextDescription = description.trim();
    const nextAssignee = assignee.trim();
    const nextLocation = location.trim();

    if (!nextTitle || !nextDescription || !type || !audience || !nextAssignee || !nextLocation || !date || !time) {
      setError("All fields are required.");
      return;
    }

    setError("");
    onPost({
      title: nextTitle,
      description: nextDescription,
      type,
      audience,
      assignee: nextAssignee,
      location: nextLocation,
      date,
      time,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close post event"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="bg-brgy-sidebar px-5 py-4 text-white">
          <p className="text-sm text-white/80">Barangay events</p>
          <h2 className="mt-1 text-2xl font-semibold">Post event</h2>
        </div>

        <form className="space-y-4 px-5 py-5" onSubmit={handlePost}>
          <TextField
            label="Event title"
            value={title}
            placeholder="Example: Rice pack release"
            onChange={(value) => {
              setTitle(value);
              setError("");
            }}
          />
          <label className="block">
            <RequiredLabel>Description</RequiredLabel>
            <textarea
              required
              value={description}
              placeholder="Write what this event is about"
              rows={4}
              onChange={(event) => {
                setDescription(event.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-[#c5d4f0] bg-white px-3 py-2.5 text-sm text-brgy-ink outline-none"
            />
          </label>
          <label className="block">
            <RequiredLabel>Who this event is for</RequiredLabel>
            <span className="relative block">
              <select
                required
                value={audience}
                onChange={(event) => {
                  setAudience(event.target.value as EventAudience | "");
                  setError("");
                }}
                className="w-full appearance-none rounded-lg border border-[#c5d4f0] bg-white px-3 py-2.5 pr-10 text-sm text-brgy-ink outline-none"
              >
                <option value="">Select who can join</option>
                {eventAudiences.map((eventAudience) => (
                  <option key={eventAudience} value={eventAudience}>
                    {eventAudience === "All" ? "All residents" : eventAudience}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 20 20"
                className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-brgy-sidebar"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m5 7.5 5 5 5-5" />
              </svg>
            </span>
          </label>
          <label className="block">
            <RequiredLabel>What this event is for</RequiredLabel>
            <span className="relative block">
              <select
                required
                value={type}
                onChange={(event) => {
                  setType(event.target.value as EventType | "");
                  setError("");
                }}
                className="w-full appearance-none rounded-lg border border-[#c5d4f0] bg-white px-3 py-2.5 pr-10 text-sm text-brgy-ink outline-none"
              >
                <option value="">Select the type of event</option>
                {eventTypes.map((eventType) => (
                  <option key={eventType} value={eventType}>
                    {eventType}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 20 20"
                className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-brgy-sidebar"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m5 7.5 5 5 5-5" />
              </svg>
            </span>
          </label>
          <TextField
            label="Assignee"
            value={assignee}
            placeholder="Example: Kagawad Dela Cruz"
            onChange={(value) => {
              setAssignee(value);
              setError("");
            }}
          />
          <TextField
            label="Location"
            value={location}
            placeholder="Example: Barangay Covered Court"
            onChange={(value) => {
              setLocation(value);
              setError("");
            }}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <RequiredLabel>Event date</RequiredLabel>
              <input
                type="date"
                required
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setError("");
                }}
                className="w-full rounded-lg border border-[#c5d4f0] bg-white px-3 py-2.5 text-sm text-brgy-ink outline-none"
              />
            </label>
            <label className="block">
              <RequiredLabel>Event time</RequiredLabel>
              <input
                type="time"
                required
                value={time}
                onChange={(event) => {
                  setTime(event.target.value);
                  setError("");
                }}
                className="w-full rounded-lg border border-[#c5d4f0] bg-white px-3 py-2.5 text-sm text-brgy-ink outline-none"
              />
            </label>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="md" type="submit" loading={loading}>
              Post event
            </Button>
            <Button size="md" variant="secondary" disabled={loading} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
