import { useState } from "react";
import { RoomSetup } from "../components/realtimeCanvas/RoomSetup";
import { CanvasRoom } from "../components/realtimeCanvas/CanvasRoom";
import { useCanvasStore } from "../store/canvasStore";

export function RealtimeCanvas() {
  const [hasJoined, setHasJoined] = useState(false);
  const { roomId } = useCanvasStore();

  const handleJoinRoom = () => {
    setHasJoined(true);
  };

  return (
    <div className="min-h-screen">
      {!hasJoined || !roomId ? (
        <RoomSetup onJoinRoom={handleJoinRoom} />
      ) : (
        <CanvasRoom />
      )}
    </div>
  );
}
