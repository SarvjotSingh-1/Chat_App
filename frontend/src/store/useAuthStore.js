import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("error in checkAuth", error);
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
      // notification with toast
      toast.success("Account Created Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      // notification with toast
      toast.success("loggedIn Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("User logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("error in logout", error);
    }
  },

  // this is base64 url and not professional way

  //   //   updateProfile: async (data) => {
  //   //     try {
  //   //       const res = await axiosInstance.put("/auth/update-profile", data);
  //   //       set({ authUser: res.data });
  //   //       toast.success("Profile updated successfully");
  //   //     } catch (error) {
  //   //       console.log("error in updateProfile", error);
  //   //       toast.error(error.response.data.message);
  //   //     }
  //   //   },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ authUser: res.data });

      toast.success("Profile updated successfully 🎉");

      return res.data;
    } catch (error) {
      console.log("error in updateProfile", error);

      const message =
        error?.response?.data?.message ||
        "Failed to update profile. Please try again.";

      toast.error(message);

      throw error; // important so caller can handle it
    }
  },
}));
