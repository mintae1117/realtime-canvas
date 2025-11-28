import React, { useRef, useEffect } from "react";
import { useFacetimeStore } from "../../store/facetimeStore";
import { FaMicrophoneSlash, FaVideoSlash, FaUser } from "react-icons/fa";

interface VideoTileProps {
  stream: MediaStream | null;
  name: string;
  color: string;
  isLocal?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
}

const VideoTile: React.FC<VideoTileProps> = ({
  stream,
  name,
  color,
  isLocal = false,
  isMuted = false,
  isVideoOff = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const hasVideo = stream && stream.getVideoTracks().length > 0 && !isVideoOff;

  return (
    <div
      className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video shadow-lg"
      style={{ borderColor: color, borderWidth: "2px" }}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <FaUser className="text-white text-3xl" />
          </div>
        </div>
      )}

      {/* Name tag */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div
          className="px-2 py-1 rounded-lg text-white text-sm font-medium backdrop-blur-sm"
          style={{ backgroundColor: `${color}CC` }}
        >
          {name} {isLocal && "(나)"}
        </div>
        <div className="flex items-center gap-1">
          {isMuted && (
            <div className="p-1.5 bg-red-500 rounded-full">
              <FaMicrophoneSlash className="text-white text-xs" />
            </div>
          )}
          {isVideoOff && (
            <div className="p-1.5 bg-red-500 rounded-full">
              <FaVideoSlash className="text-white text-xs" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const VideoGrid: React.FC = () => {
  const {
    currentUser,
    users,
    localStream,
    remoteStreams,
    isVideoEnabled,
    isAudioEnabled,
  } = useFacetimeStore();

  const totalParticipants = 1 + remoteStreams.size; // Local + Remote

  // Determine grid layout based on participant count
  const getGridClass = () => {
    if (totalParticipants === 1) return "grid-cols-1 max-w-2xl";
    if (totalParticipants === 2) return "grid-cols-1 md:grid-cols-2 max-w-4xl";
    if (totalParticipants <= 4) return "grid-cols-2 max-w-4xl";
    if (totalParticipants <= 6) return "grid-cols-2 md:grid-cols-3 max-w-5xl";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl";
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className={`grid gap-4 w-full mx-auto ${getGridClass()}`}>
        {/* Local Video */}
        {currentUser && (
          <VideoTile
            stream={localStream}
            name={currentUser.name}
            color={currentUser.color}
            isLocal
            isMuted={!isAudioEnabled}
            isVideoOff={!isVideoEnabled}
          />
        )}

        {/* Remote Videos */}
        {Array.from(remoteStreams.entries()).map(([userId, stream]) => {
          const user = users.find((u) => u.id === userId);
          if (!user) return null;

          return (
            <VideoTile
              key={userId}
              stream={stream}
              name={user.name}
              color={user.color}
            />
          );
        })}
      </div>
    </div>
  );
};
