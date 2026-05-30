export function toISODate(d) {
  const date = d instanceof Date ? d : new Date(d);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatMoney(amount) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return String(amount);
  }
}
