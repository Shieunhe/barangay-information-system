const phpTimeZone = "Asia/Manila";

function parseDate(value: string | Date) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatInPhpTime(value: string | Date, options: Intl.DateTimeFormatOptions) {
  const date = parseDate(value);

  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: phpTimeZone,
  }).format(date);
}

export function toPhpDate(value: string | Date) {
  return (
    formatInPhpTime(value, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) ?? (typeof value === "string" && value ? value : "—")
  );
}

export function toPhpTime(value: string | Date) {
  return (
    formatInPhpTime(value, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) ?? ""
  );
}

export function toPhpDateTime(value: string | Date) {
  const date = parseDate(value);

  if (!date) {
    return typeof value === "string" && value ? value : "—";
  }

  return `${toPhpDate(date)}, ${toPhpTime(date)}`;
}

export function toPhpClock(value: string | Date) {
  const datePart = formatInPhpTime(value, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = formatInPhpTime(value, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  if (!datePart || !timePart) {
    return "—";
  }

  return `${datePart} | ${timePart} UTC+8`;
}
