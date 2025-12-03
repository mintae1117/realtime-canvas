import React from "react";
import { useNavigate } from "react-router-dom";
import { useRealtimeLocationStore } from "../../store/realtimeLocationStore";
import { FaLocationArrow, FaStopCircle, FaSignOutAlt } from "react-icons/fa";

interface LocationControlsProps {
  onStartWatching: () => void;
  onStopWatching: () => void;
  onLeaveRoom: () => void;
}

export const LocationControls: React.FC<LocationControlsProps> = ({
  onStartWatching,
  onStopWatching,
  onLeaveRoom,
}) => {
  const navigate = useNavigate();
  const { isWatching, resetStore } = useRealtimeLocationStore();

  const handleLeave = () => {
    onLeaveRoom();
    resetStore();
    navigate("/location");
  };

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-gray-900/80 backdrop-blur-sm rounded-2xl">
      {/* Location Toggle */}
      <button
        onClick={isWatching ? onStopWatching : onStartWatching}
        className={`p-4 rounded-full transition-all transform hover:scale-105 active:scale-95 ${
          isWatching
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-white"
        }`}
        title={isWatching ? "위치 공유 중지" : "위치 공유 시작"}
      >
        {isWatching ? (
          <FaLocationArrow className="text-xl" />
        ) : (
          <FaStopCircle className="text-xl" />
        )}
      </button>

      {/* Leave Room */}
      <button
        onClick={handleLeave}
        className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all transform hover:scale-105 active:scale-95"
        title="방 나가기"
      >
        <FaSignOutAlt className="text-xl" />
      </button>
    </div>
  );
};
