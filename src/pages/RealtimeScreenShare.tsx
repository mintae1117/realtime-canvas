import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  ScreenShareRoom,
  ScreenShareRoomSetup,
} from "../components/realtimeScreen";
import { useScreenShareStore } from "../store/screenShareStore";

export function RealtimeScreenShare() {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const { roomId, currentUser, setRoomId, resetStore } = useScreenShareStore();

  // Sync URL roomId with store
  useEffect(() => {
    if (urlRoomId && urlRoomId !== roomId) {
      setRoomId(urlRoomId);
    }
  }, [urlRoomId, roomId, setRoomId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetStore();
    };
  }, [resetStore]);

  // Show setup if no room or no user
  if (!urlRoomId || !currentUser) {
    return <ScreenShareRoomSetup />;
  }

  return <ScreenShareRoom />;
}
