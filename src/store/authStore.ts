import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { authAPI } from "@/services/api/auth";
import { userAPI } from "@/services/api/user";
import { useCartStore } from "./cartStore";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.login({ email, password });
          const { user, accessToken, refreshToken } = data.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (registerData) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.register(registerData);
          const { user, accessToken, refreshToken } = data.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },


      logout: () => {
        authAPI.logout(localStorage.getItem("refreshToken") || "").catch(() => {});
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        useCartStore.getState().clearCart();
        set({ user: null, accessToken: null, refreshToken: null });
      },

      updateProfile: async (profileData) => {
        const { data } = await userAPI.updateProfile(profileData);
        set({ user: data.data.user });
      },

      setUser: (user) => set({ user }),

      isAuthenticated: () => !!get().accessToken,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
