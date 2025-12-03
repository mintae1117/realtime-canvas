import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  LocationRoom,
  LocationRoomSetup,
} from "../components/realtimeLocation";
import { useRealtimeLocationStore } from "../store/realtimeLocationStore";

export function RealtimeLocation() {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const { roomId, currentUser, setRoomId, resetStore } =
    useRealtimeLocationStore();

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
    return <LocationRoomSetup />;
  }

  return <LocationRoom />;
}
