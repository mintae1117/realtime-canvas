import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { ChatRoom, ChatRoomSetup } from "../components/realtimeChat";
import { useChatStore } from "../store/chatStore";

export function RealtimeChat() {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const { roomId, currentUser, setRoomId, resetStore } = useChatStore();

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
    return <ChatRoomSetup />;
  }

  return <ChatRoom />;
}
