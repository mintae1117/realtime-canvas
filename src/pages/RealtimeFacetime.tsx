import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  FacetimeRoom,
  FacetimeRoomSetup,
} from "../components/realtimeFacetime";
import { useFacetimeStore } from "../store/facetimeStore";

export function RealtimeFacetime() {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const { roomId, currentUser, setRoomId, resetStore } = useFacetimeStore();

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
    return <FacetimeRoomSetup />;
  }

  return <FacetimeRoom />;
}
