import React, { useEffect, useState } from "react";
import { useFacetimeStore } from "../../store/facetimeStore";
import { useRealtimeFacetime } from "../../hooks/useRealtimeFacetime";
import { VideoGrid } from "./VideoGrid";
import { FacetimeControls } from "./FacetimeControls";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";

export const FacetimeRoom: React.FC = () => {
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const { roomId, currentUser, users, localStream, remoteStreams } =
    useFacetimeStore();

  const { isConnected, getUserMedia, toggleVideo, toggleAudio, leaveRoom } =
    useRealtimeFacetime(roomId);

  // Initialize media on mount
  useEffect(() => {
    const initMedia = async () => {
      setIsInitializing(true);
      await getUserMedia();
      setIsInitializing(false);
    };

    if (currentUser && roomId) {
      initMedia();
    }
  }, [currentUser, roomId, getUserMedia]);

  const totalUsers = users.length + (currentUser ? 1 : 0);

  // Loading state
  if (isInitializing || !localStream) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
        <div className="text-center text-white">
          <FaSpinner className="text-4xl animate-spin mx-auto mb-4" />
          <p className="text-lg">카메라와 마이크를 연결하는 중...</p>
          <p className="text-sm text-purple-200 mt-2">
            카메라/마이크 권한을 허용해주세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="flex-shrink-0 bg-black/30 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold text-white">화상통화</h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-200 font-mono">
                  #{roomId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-xs text-purple-200">
                {isConnected ? "연결됨" : "연결 중..."}
              </span>
            </div>
            {/* User count */}
            <button
              onClick={() => setIsUserListOpen(!isUserListOpen)}
              className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-white text-xs hover:bg-white/30 transition-colors"
            >
              <span>{totalUsers}명</span>
              {isUserListOpen ? (
                <IoChevronUp className="text-sm" />
              ) : (
                <IoChevronDown className="text-sm" />
              )}
            </button>
          </div>
        </div>

        {/* User List Dropdown */}
        {isUserListOpen && (
          <div className="mt-3 bg-white/10 rounded-lg p-2 backdrop-blur-sm max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {currentUser && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 rounded-full">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentUser.color }}
                  />
                  <span className="text-xs text-white font-medium">
                    {currentUser.name} (나)
                  </span>
                </div>
              )}
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-full"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="text-xs text-white/90">{user.name}</span>
                  {remoteStreams.has(user.id) && (
                    <span className="text-green-400 text-xs">●</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Video Grid */}
      <div className="flex-1 overflow-hidden">
        <VideoGrid />
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 p-4 flex justify-center">
        <FacetimeControls
          onToggleVideo={toggleVideo}
          onToggleAudio={toggleAudio}
          onLeaveRoom={leaveRoom}
        />
      </div>
    </div>
  );
};
