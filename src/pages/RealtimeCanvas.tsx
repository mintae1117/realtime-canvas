import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomSetup } from "../components/realtimeCanvas/RoomSetup";
import { CanvasRoom } from "../components/realtimeCanvas/CanvasRoom";
import { useCanvasStore } from "../store/canvasStore";

export function RealtimeCanvas() {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const { roomId, setRoomId } = useCanvasStore();

  // URL에 roomId가 있으면 스토어에 설정
  useEffect(() => {
    if (urlRoomId) {
      setRoomId(urlRoomId);
    }
  }, [urlRoomId, setRoomId]);

  // /canvas -> RoomSetup, /canvas/:roomId -> CanvasRoom
  if (!urlRoomId) {
    return <RoomSetup />;
  }

  // URL에 roomId가 있지만 아직 스토어에 설정되지 않은 경우 로딩
  if (!roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return <CanvasRoom />;
}
