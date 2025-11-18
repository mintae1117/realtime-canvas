import { useState } from "react";
import { RoomSetup } from "./components/RoomSetup";
import { CanvasRoom } from "./components/CanvasRoom";
import { useCanvasStore } from "./store/canvasStore";

function App() {
  const [hasJoined, setHasJoined] = useState(false);
  const { roomId } = useCanvasStore();

  const handleJoinRoom = () => {
    setHasJoined(true);
  };

  return (
    <div className="h-full w-full min-h-screen" style={{ minWidth: "100vw" }}>
      {!hasJoined || !roomId ? (
        <RoomSetup onJoinRoom={handleJoinRoom} />
      ) : (
        <CanvasRoom />
      )}
    </div>
  );
}

export default App;
