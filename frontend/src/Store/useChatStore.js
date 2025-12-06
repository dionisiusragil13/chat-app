import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import useAuthStore from "./useAuthStore";

const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTabs: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

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
  getMessagesByUserId: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      cratedAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      set({ messages: messages });
      toast.error(error.response.data.message || "something went wrong");
    }
  },

  subscribeToMessage: () => {
    const { selectedUser, isSoundEnabeld } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isMessafeSentFronSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessafeSentFronSelectedUser) return;
      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });
      if (isSoundEnabeld) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((e) => console.log("audio play failed", e));
      }
    });
  },
  unSubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));

export default useChatStore;
