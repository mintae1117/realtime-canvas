/* eslint-disable react-hooks/purity */
import React, { useState } from "react";
import { useRealtimeLocationStore } from "../../store/realtimeLocationStore";
import { useRealtimeLocation } from "../../hooks/useRealtimeLocation";
import { LocationMap } from "./LocationMap";
import { LocationControls } from "./LocationControls";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

export const LocationRoom: React.FC = () => {
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const { roomId, currentUser, users, isWatching, locationError } =
    useRealtimeLocationStore();

  const {
    isConnected,
    startWatchingLocation,
    stopWatchingLocation,
    leaveRoom,
  } = useRealtimeLocation(roomId);

  const totalUsers = users.length + (currentUser ? 1 : 0);

  // Format last updated time
  const formatLastUpdated = (timestamp: number | null) => {
    if (!timestamp) return "위치 정보 없음";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 5) return "방금 전";
    if (seconds < 60) return `${seconds}초 전`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분 전`;
    return "오래 전";
  };

  // Loading state
  if (!isConnected) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-900 via-orange-900 to-amber-900">
        <div className="text-center text-white">
          <FaSpinner className="text-4xl animate-spin mx-auto mb-4" />
          <p className="text-lg">위치 공유 방에 연결하는 중...</p>
          <p className="text-sm text-red-200 mt-2">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-900 via-red-900 to-orange-900">
      {/* Header */}
      <header className="flex-shrink-0 bg-black/30 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold text-white">위치 공유</h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-200 font-mono">
                  #{roomId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Location Status */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  isWatching ? "bg-green-400 animate-pulse" : "bg-yellow-400"
                }`}
              />
              <span className="text-xs text-red-200">
                {isWatching ? "공유 중" : "대기 중"}
              </span>
            </div>
            {/* Connection Status */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-xs text-red-200">
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
          <div className="mt-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm max-w-6xl mx-auto">
            <div className="space-y-2">
              {currentUser && (
                <div className="flex items-center justify-between px-3 py-2 bg-white/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: currentUser.color }}
                    />
                    <span className="text-sm text-white font-medium">
                      {currentUser.name} (나)
                    </span>
                  </div>
                  <div className="text-xs text-white/70">
                    {currentUser.latitude && currentUser.longitude ? (
                      <span className="text-green-300">
                        {formatLastUpdated(currentUser.lastUpdated)}
                      </span>
                    ) : (
                      <span className="text-yellow-300">위치 대기 중</span>
                    )}
                  </div>
                </div>
              )}
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-3 py-2 bg-white/10 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-sm text-white/90">{user.name}</span>
                  </div>
                  <div className="text-xs text-white/70">
                    {user.latitude && user.longitude ? (
                      <span className="text-green-300">
                        {formatLastUpdated(user.lastUpdated)}
                      </span>
                    ) : (
                      <span className="text-yellow-300">위치 대기 중</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Error */}
        {locationError && (
          <div className="mt-3 bg-red-500/30 rounded-lg p-3 backdrop-blur-sm max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-red-200">
              <FaExclamationTriangle />
              <span className="text-sm">{locationError}</span>
            </div>
          </div>
        )}
      </header>

      {/* Map */}
      <div className="flex-1 overflow-hidden">
        <LocationMap />
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 p-4 flex justify-center">
        <LocationControls
          onStartWatching={startWatchingLocation}
          onStopWatching={stopWatchingLocation}
          onLeaveRoom={leaveRoom}
        />
      </div>
    </div>
  );
};
