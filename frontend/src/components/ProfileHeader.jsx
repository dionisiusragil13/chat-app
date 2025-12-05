import { useState } from "react";
import { useRef } from "react";
import useAuthStore from "../store/useAuthStore.js";
import useChatStore from "../store/useChatStore.js";
import { VolumeOffIcon, LogOutIcon, Volume2Icon } from "lucide-react";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };
  return (
    <div className="p-6 border-b bg-slate-700/50 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser?.profilePicture || "/avatar.png"}
                alt="Profile"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-xs text-white">Change</span>
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="text-slate-200 font-medium text-base max-w-[180px] truncate">
            <h3>{authUser?.name}</h3>
            <p className="text-xs text-slate-400">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="hover:text-slate-200 text-slate-400 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound
                .play()
                .catch((error) => console.log("audio player error:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
