import { http } from "../lib/http";

export const roomsApi = {
  async list() {
    const { data } = await http.get("/api/rooms");
    return data?.rooms || [];
  },

  async create(payload) {
    const { data } = await http.post("/api/rooms", payload);
    return data;
  },

  async update(id, patch) {
    const { data } = await http.patch(`/api/rooms/${id}`, patch);
    return data;
  },

  //  delete room
  async remove(id) {
    const { data } = await http.delete(`/api/rooms/${id}`);
    return data;
  },
};
