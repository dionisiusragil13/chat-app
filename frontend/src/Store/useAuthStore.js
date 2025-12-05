import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIn: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Signup successful!");
    } catch (error) {
      toast.error(error.response.data.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);

      // Line 43 is here if it's the 7th line inside login
      set({ authUser: res.data });

      toast.success("Login successful!");
      get().connectSocket();
    } catch (error) {
      // 💡 SOLVE: Check if error.response exists
      const errorMessage = error.response
        ? error.response.data.message
        : "Network error or server unreachable. Login failed.";

      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed");
    }
  },
  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile");
      set({ authUser: res.data });
      toast.success("profile update succesfully");
    } catch (error) {
      console.log("error in update profile",error)
      toast.error(error.response.data.message)
    }
  },
}));

export default useAuthStore;
