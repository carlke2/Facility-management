import { http } from "../lib/http";

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

function pickFilename(contentDisposition, fallback) {
  if (!contentDisposition) return fallback;
  const match = /filename="?([^"]+)"?/i.exec(contentDisposition);
  return match?.[1] || fallback;
}

export const bookingsApi = {
  async create(payload) {
    const { data } = await http.post("/api/bookings", payload);
    return data;
  },

  async mine() {
    const { data } = await http.get("/api/bookings/mine");
    return data;
  },

  async cancel(id) {
    const { data } = await http.delete(`/api/bookings/${id}`);
    return data;
  },

  //  Admin: list bookings for a range (REAL bookings from Mongo)
  async listAdmin(fromISO, toISO) {
    const { data } = await http.get(
      `/api/admin/bookings?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`
    );
    return data.bookings || [];
  },

  //  Admin: get one booking with populated user/room
  async getOneAdmin(id) {
    const { data } = await http.get(`/api/admin/bookings/${id}`);
    return data.booking;
  },

  //  Admin: export PDF
  async exportPdf(fromISO, toISO) {
    const res = await http.get(
      `/api/admin/reports/bookings.pdf?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`,
      { responseType: "blob" }
    );

    const filename = pickFilename(
      res.headers?.["content-disposition"],
      "bookings-report.pdf"
    );
    downloadBlob(res.data, filename);
  },

  //  Admin: export Excel
  async exportExcel(fromISO, toISO) {
    const res = await http.get(
      `/api/admin/reports/bookings.xlsx?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`,
      { responseType: "blob" }
    );

    const filename = pickFilename(
      res.headers?.["content-disposition"],
      "bookings-report.xlsx"
    );
    downloadBlob(res.data, filename);
  },
};
