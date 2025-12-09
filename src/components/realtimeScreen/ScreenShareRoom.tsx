import React, { useState } from "react";
import { useScreenShareStore } from "../../store/screenShareStore";
import { useRealtimeScreenShare } from "../../hooks/useRealtimeScreenShare";
import { ScreenGrid } from "./ScreenGrid";
import { ScreenShareControls } from "./ScreenShareControls";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { FaDesktop } from "react-icons/fa";

export const ScreenShareRoom: React.FC = () => {
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const { roomId, currentUser, users, remoteStreams, isSharing } =
    useScreenShareStore();

  const { isConnected, startScreenShare, stopScreenShare, leaveRoom } =
    useRealtimeScreenShare(roomId);

  const totalUsers = users.length + (currentUser ? 1 : 0);
  const sharingUsers =
    users.filter((u) => u.isSharing).length + (isSharing ? 1 : 0);

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-900 via-cyan-900 to-blue-900">
      {/* Header */}
      <header className="flex-shrink-0 bg-black/30 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <FaDesktop className="text-cyan-400" />
                화면공유
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-cyan-200 font-mono">
                  #{roomId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Sharing count */}
            {sharingUsers > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-cyan-500/30 rounded-full">
                <FaDesktop className="text-cyan-400 text-xs" />
                <span className="text-xs text-cyan-200">
                  {sharingUsers}명 공유중
                </span>
              </div>
            )}
            {/* Connection Status */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-xs text-cyan-200">
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
                  {isSharing && <FaDesktop className="text-cyan-400 text-xs" />}
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
                  {user.isSharing && (
                    <FaDesktop className="text-cyan-400 text-xs" />
                  )}
                  {remoteStreams.has(user.id) && (
                    <span className="text-green-400 text-xs">●</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Screen Grid */}
      <div className="flex-1 overflow-hidden p-4">
        <ScreenGrid />
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 p-4 flex justify-center">
        <ScreenShareControls
          isSharing={isSharing}
          onStartShare={startScreenShare}
          onStopShare={stopScreenShare}
          onLeaveRoom={leaveRoom}
        />
      </div>
    </div>
  );
};
