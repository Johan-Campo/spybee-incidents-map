import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CURRENT_USER } from "@/lib/incidentOptions";
import type { IncidentUser } from "@/types/incident";

interface AuthState {
  user: IncidentUser | null;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: () => set({ user: CURRENT_USER }),
      logout: () => set({ user: null }),
    }),
    { name: "spybee-auth" }
  )
);
