import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: {
    name: "JOhn",
    _id: 123,
    age: 25,
    isLoggedIn: false,
    isLoading: false,
  },
  login: () => {
    console.log("we just logined");
    set({
      isLoggedIn: true,
      isLoading: true,
    });

    // couple of functions
  },
}));
