export function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
}

/** 12000234000 -> "12 000 234 000" */
export function formatNumber(v: string | number) {
  const d = typeof v === "number" ? String(Math.round(v)) : digitsOnly(v);
  if (!d) return "";
  return d.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function parseNumber(v: string) {
  const d = digitsOnly(v);
  return d ? Number(d) : 0;
}

/** digits after 998 -> "90 123 45 67" */
export function formatPhoneLocal(v: string) {
  const d = digitsOnly(v).slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return parts.join(" ");
}
