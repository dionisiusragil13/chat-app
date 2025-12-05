import useChatStore from "../store/useChatStore";

function ActiveTabSwitch() {
  const { setActiveTabs, activeTabs } = useChatStore();
  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <button
        onClick={() => activeTabs("chats")}
        className={`tab ${
          activeTabs === "chats"
            ? "bg-cyan-500/20 text-cyan-200"
            : "text-slate-400"
        }`}
      >
        Chats
      </button>
      <button
        onClick={() => activeTabs("contacts")}
        className={`tab ${
          activeTabs === "contacts"
            ? "bg-cyan-500/20 text-cyan-200"
            : "text-slate-400"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;
