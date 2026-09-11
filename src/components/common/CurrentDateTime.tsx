"use client";

import { useEffect, useState } from "react";
import { toPhpClock } from "@/common/phpTime";

export function CurrentDateTime() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => setNow(toPhpClock(new Date()));

    tick();
    const id = window.setInterval(tick, 1000);

    return () => window.clearInterval(id);
  }, []);

  return <p className="text-sm text-neutral-500">{now || "—"}</p>;
}
