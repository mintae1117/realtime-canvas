import React, { useEffect, useRef } from "react";
import { useScreenShareStore } from "../../store/screenShareStore";
import { FaDesktop, FaUser, FaExpand } from "react-icons/fa";

interface ScreenTileProps {
  stream: MediaStream;
  userName: string;
  userColor: string;
  isLocal?: boolean;
}

const ScreenTile: React.FC<ScreenTileProps> = ({
  stream,
  userName,
  userColor,
  isLocal = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-contain bg-black"
      />

      {/* User info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: userColor }}
            />
            <span className="text-white text-sm font-medium">
              {userName}
              {isLocal && " (나)"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaDesktop className="text-cyan-400 text-sm" />
          </div>
        </div>
      </div>

      {/* Fullscreen button */}
      <button
        onClick={handleFullscreen}
        className="absolute top-3 right-3 p-2 bg-black/50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        title="전체화면"
      >
        <FaExpand className="text-sm" />
      </button>

      {/* Local badge */}
      {isLocal && (
        <div className="absolute top-3 left-3 px-2 py-1 bg-cyan-500/80 rounded-full text-xs text-white">
          내 화면
        </div>
      )}
    </div>
  );
};

export const ScreenGrid: React.FC = () => {
  const { currentUser, users, localStream, remoteStreams, isSharing } =
    useScreenShareStore();

  // Get all sharing streams
  const sharingStreams: Array<{
    id: string;
    stream: MediaStream;
    userName: string;
    userColor: string;
    isLocal: boolean;
  }> = [];

  // Add local stream if sharing
  if (isSharing && localStream && currentUser) {
    sharingStreams.push({
      id: currentUser.id,
      stream: localStream,
      userName: currentUser.name,
      userColor: currentUser.color,
      isLocal: true,
    });
  }

  // Add remote streams
  remoteStreams.forEach((stream, oduderId) => {
    const user = users.find((u) => u.id === oduderId);
    if (user) {
      sharingStreams.push({
        id: oduderId,
        stream,
        userName: user.name,
        userColor: user.color,
        isLocal: false,
      });
    }
  });

  // Calculate grid layout
  const getGridClass = () => {
    const count = sharingStreams.length;
    if (count === 0) return "";
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  // Empty state
  if (sharingStreams.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
            <FaDesktop className="text-4xl text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            화면 공유 대기중
          </h2>
          <p className="text-cyan-200 text-sm mb-4">
            아래 버튼을 눌러 화면을 공유하거나
            <br />
            다른 참가자의 화면 공유를 기다려주세요
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {currentUser && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentUser.color }}
                />
                <span className="text-xs text-white">{currentUser.name}</span>
                <FaUser className="text-white/50 text-xs" />
              </div>
            )}
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <span className="text-xs text-white/80">{user.name}</span>
                <FaUser className="text-white/50 text-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full grid ${getGridClass()} gap-4 auto-rows-fr`}>
      {sharingStreams.map(({ id, stream, userName, userColor, isLocal }) => (
        <ScreenTile
          key={id}
          stream={stream}
          userName={userName}
          userColor={userColor}
          isLocal={isLocal}
        />
      ))}
    </div>
  );
};
