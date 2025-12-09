import React from "react";
import { useNavigate } from "react-router-dom";
import { FaDesktop, FaStop, FaSignOutAlt } from "react-icons/fa";
import { useScreenShareStore } from "../../store/screenShareStore";

interface ScreenShareControlsProps {
  isSharing: boolean;
  onStartShare: () => void;
  onStopShare: () => void;
  onLeaveRoom: () => void;
}

export const ScreenShareControls: React.FC<ScreenShareControlsProps> = ({
  isSharing,
  onStartShare,
  onStopShare,
  onLeaveRoom,
}) => {
  const navigate = useNavigate();
  const { resetStore } = useScreenShareStore();

  const handleLeave = () => {
    onLeaveRoom();
    resetStore();
    navigate("/screen");
  };

  return (
    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-full px-6 py-3">
      {/* Screen Share Toggle */}
      {isSharing ? (
        <button
          onClick={onStopShare}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
          title="화면 공유 중지"
        >
          <FaStop className="text-sm" />
          <span className="text-sm font-medium">공유 중지</span>
        </button>
      ) : (
        <button
          onClick={onStartShare}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition-colors"
          title="화면 공유 시작"
        >
          <FaDesktop className="text-sm" />
          <span className="text-sm font-medium">화면 공유</span>
        </button>
      )}

      {/* Divider */}
      <div className="w-px h-8 bg-white/20" />

      {/* Leave Room */}
      <button
        onClick={handleLeave}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors"
        title="방 나가기"
      >
        <FaSignOutAlt className="text-sm" />
        <span className="text-sm font-medium">나가기</span>
      </button>
    </div>
  );
};
