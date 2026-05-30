import { http } from "../lib/http";

export const remindersApi = {
  async mine() {
    const { data } = await http.get("/api/reminders/mine");
    return data;
  },

  async mineUpcoming() {
    const { data } = await http.get("/api/reminders/mine?upcoming=true");
    return data;
  },
};
