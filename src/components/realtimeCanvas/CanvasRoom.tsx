import React, { useRef } from "react";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { UserList } from "./UserList";
import { useCanvasStore } from "../../store/canvasStore";
import { useRealtimeCanvas } from "../../hooks/useRealtimeCanvas";

export const CanvasRoom: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { roomId, currentUser, clearCanvas } = useCanvasStore();
  const { sendLine, sendImage, sendClearCanvas, isConnected } =
    useRealtimeCanvas(roomId);

  const handleClearCanvas = () => {
    if (
      window.confirm(
        "캔버스를 전체 지울까요? 모든 참가자의 화면이 초기화됩니다."
      )
    ) {
      clearCanvas();
      sendClearCanvas();
    }
  };

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Header */}
      <div className="max-w-[1800px] mx-auto mb-4">
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              실시간 학습 캔버스
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              방 ID: <span className="font-mono font-semibold">{roomId}</span>
              {currentUser && (
                <span className="ml-4">
                  {currentUser.name} (
                  {currentUser.role === "teacher" ? "선생님" : "학생"})
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-700">
                {isConnected ? "연결됨" : "연결 안됨"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto grid grid-cols-12 gap-4">
        {/* Toolbar */}
        <div className="col-span-12 lg:col-span-2">
          <Toolbar
            onClearCanvas={handleClearCanvas}
            onUploadImage={handleUploadImage}
          />
        </div>

        {/* Canvas */}
        <div className="col-span-12 lg:col-span-8">
          <Canvas width={1200} height={800} onDrawingComplete={sendLine} />
        </div>

        {/* User List */}
        <div className="col-span-12 lg:col-span-2">
          <UserList />
        </div>
      </div>

      {/* Hidden Image Upload Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const url = event.target?.result as string;
              const img = new Image();
              img.onload = () => {
                const maxWidth = 800;
                const maxHeight = 600;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                  const ratio = Math.min(maxWidth / width, maxHeight / height);
                  width *= ratio;
                  height *= ratio;
                }

                const newImage = {
                  id: crypto.randomUUID(),
                  url,
                  x: 50,
                  y: 50,
                  width,
                  height,
                  rotation: 0,
                  userId: currentUser?.id || "anonymous",
                  timestamp: Date.now(),
                };

                useCanvasStore.getState().addImage(newImage);
                sendImage(newImage);
              };
              img.src = url;
            };
            reader.readAsDataURL(file);
          }
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
};
