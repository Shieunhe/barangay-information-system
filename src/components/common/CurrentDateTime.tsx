"use client";

import { useEffect, useState } from "react";

function formatDateTime(date: Date) {
  const datePart = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  }).format(date);

  return `${datePart} | ${timePart} UTC+8`;
}

export function CurrentDateTime() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => setNow(formatDateTime(new Date()));

    tick();
    const id = window.setInterval(tick, 1000);

    return () => window.clearInterval(id);
  }, []);

  return <p className="text-sm text-neutral-500">{now || "—"}</p>;
}
