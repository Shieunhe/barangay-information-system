export function formatPhMobile(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (!digits) {
    return "";
  }

  if (digits.startsWith("9")) {
    return `0${digits}`.slice(0, 11);
  }

  if (!digits.startsWith("0")) {
    return "";
  }

  if (digits.length === 1) {
    return "0";
  }

  if (digits[1] !== "9") {
    return "0";
  }

  return digits;
}

export function isPhMobile(value: string) {
  return /^09\d{9}$/.test(value);
}
