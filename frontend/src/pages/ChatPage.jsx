import React from "react";
import  useAuthStore  from "../store/useAuthStore.js";

function ChatPage() {
  const { logout } = useAuthStore();
  return (
    <div className="z-10">
      <button onClick={logout}>Logout</button>
      ChatPage
    </div>
  );
}

export default ChatPage;
