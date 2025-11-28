import React from "react";
import { useNavigate } from "react-router-dom";
import { useFacetimeStore } from "../../store/facetimeStore";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";

interface FacetimeControlsProps {
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onLeaveRoom: () => void;
}

export const FacetimeControls: React.FC<FacetimeControlsProps> = ({
  onToggleVideo,
  onToggleAudio,
  onLeaveRoom,
}) => {
  const navigate = useNavigate();
  const { isVideoEnabled, isAudioEnabled, resetStore } = useFacetimeStore();

  const handleLeave = () => {
    onLeaveRoom();
    resetStore();
    navigate("/facetime");
  };

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-gray-900/80 backdrop-blur-sm rounded-2xl">
      {/* Audio Toggle */}
      <button
        onClick={onToggleAudio}
        className={`p-4 rounded-full transition-all transform hover:scale-105 active:scale-95 ${
          isAudioEnabled
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
        title={isAudioEnabled ? "마이크 끄기" : "마이크 켜기"}
      >
        {isAudioEnabled ? (
          <FaMicrophone className="text-xl" />
        ) : (
          <FaMicrophoneSlash className="text-xl" />
        )}
      </button>

      {/* Video Toggle */}
      <button
        onClick={onToggleVideo}
        className={`p-4 rounded-full transition-all transform hover:scale-105 active:scale-95 ${
          isVideoEnabled
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
        title={isVideoEnabled ? "카메라 끄기" : "카메라 켜기"}
      >
        {isVideoEnabled ? (
          <FaVideo className="text-xl" />
        ) : (
          <FaVideoSlash className="text-xl" />
        )}
      </button>

      {/* Leave Room */}
      <button
        onClick={handleLeave}
        className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all transform hover:scale-105 active:scale-95"
        title="통화 종료"
      >
        <FaPhoneSlash className="text-xl" />
      </button>
    </div>
  );
};
