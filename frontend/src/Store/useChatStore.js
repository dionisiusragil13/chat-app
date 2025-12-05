import toast from "react-hot-toast";
import { create } from "zustand";

const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTabs: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isSoundEnabeld: localStorage.getItem("isSoundEnabeld") === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabeld", !get().isSoundEnabeld);
    set({ isSoundEnabeld: !get().isSoundEnabeld });
  },
  setActiveTabs: (tab) => set({ activeTabs: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  getAllContacts: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contact");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get("messages/chat");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isMessageLoading: false });
    }
  },
}));

export default useChatStore;
