import { create } from "zustand";
import api from "./api";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("token"),
  user: null,

  login: async (email, password) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    const { data } = await api.post("/auth/login", form);
    localStorage.setItem("token", data.access_token);
    set({ token: data.access_token });
  },

  register: async (email, name, password) => {
    await api.post("/auth/register", { email, name, password });
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data });
    } catch { /* interceptor trata 401 */ }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
    window.location.href = "/login";
  },
}));
