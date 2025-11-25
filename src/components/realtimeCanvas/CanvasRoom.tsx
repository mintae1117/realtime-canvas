import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { UserList } from "./UserList";
import { useCanvasStore } from "../../store/canvasStore";
import { useRealtimeCanvas } from "../../hooks/useRealtimeCanvas";
import {
  IoSettingsOutline,
  IoCloseOutline,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";

export const CanvasRoom: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDesktopPanelOpen, setIsDesktopPanelOpen] = useState(true);

  const { roomId, currentUser, clearCanvas } = useCanvasStore();
  const { sendLine, sendImage, sendClearCanvas, isConnected } =
    useRealtimeCanvas(roomId);

  // 반응형 캔버스 크기 조절
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current) {
        const container = canvasContainerRef.current;
        const rect = container.getBoundingClientRect();
        const padding = 8;
        const width = Math.floor(rect.width - padding * 2);
        const height = Math.floor(rect.height - padding * 2);
        setCanvasSize({
          width: Math.max(width, 300),
          height: Math.max(height, 200),
        });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      resizeObserver.disconnect();
    };
  }, [isDesktopPanelOpen]);

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
    <div className="h-screen w-full flex flex-col bg-gray-100 overflow-hidden">
      {/* Minimal Header - Mobile only shows essential info */}
      <header className="flex-shrink-0 bg-white border-b shadow-sm px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm md:text-lg font-bold text-gray-800 truncate">
              실시간 캔버스
            </h1>
            <span className="hidden md:inline-block text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
              {roomId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-xs text-gray-600 hidden sm:inline">
                {isConnected ? "연결됨" : "연결 안됨"}
              </span>
            </div>
            {/* User info - desktop */}
            {currentUser && (
              <span className="hidden lg:inline text-xs text-gray-500">
                {currentUser.name}
              </span>
            )}
            {/* Settings Button - Mobile */}
            <button
              onClick={() => setIsPanelOpen(true)}
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <IoSettingsOutline className="text-lg text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Container - Takes full space */}
        <div
          ref={canvasContainerRef}
          className="flex-1 flex items-center justify-center p-1 md:p-2 overflow-hidden"
        >
          <Canvas
            width={canvasSize.width}
            height={canvasSize.height}
            onDrawingComplete={sendLine}
          />
        </div>

        {/* Desktop Right Panel - Users + Tools */}
        <aside
          className={`
            hidden md:flex flex-col flex-shrink-0
            bg-white border-l shadow-sm
            transition-all duration-300 ease-in-out overflow-hidden
            ${isDesktopPanelOpen ? "w-52 lg:w-60" : "w-0"}
          `}
        >
          <div className="p-3 overflow-y-auto flex-1 space-y-4">
            {/* Compact User List */}
            <div>
              <h4 className="text-xs font-semibold mb-2 text-gray-500 uppercase tracking-wide">
                참가자
              </h4>
              <div className="space-y-1">
                {currentUser && (
                  <div className="flex items-center gap-2 p-1.5 bg-blue-50 rounded text-xs">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentUser.color }}
                    />
                    <span className="font-medium text-gray-700 truncate flex-1">
                      {currentUser.name} (나)
                    </span>
                  </div>
                )}
                {useCanvasStore.getState().users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded text-xs"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-gray-600 truncate flex-1">
                      {user.name}
                    </span>
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.isOnline ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Toolbar */}
            <Toolbar
              onClearCanvas={handleClearCanvas}
              onUploadImage={handleUploadImage}
              compact
            />
          </div>
        </aside>

        {/* Desktop Panel Toggle Button */}
        <button
          onClick={() => setIsDesktopPanelOpen(!isDesktopPanelOpen)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20
            bg-white border border-r-0 rounded-l-lg shadow-md
            p-1.5 hover:bg-gray-50 transition-all
            items-center justify-center"
          style={{ right: isDesktopPanelOpen ? "13rem" : "0" }}
        >
          {isDesktopPanelOpen ? (
            <IoChevronForward className="text-gray-600" />
          ) : (
            <IoChevronBack className="text-gray-600" />
          )}
        </button>

        {/* Mobile Panel Overlay */}
        {isPanelOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsPanelOpen(false)}
            />
            <aside className="md:hidden fixed right-0 top-0 bottom-0 w-72 bg-white shadow-xl z-40 overflow-y-auto">
              {/* Panel Header */}
              <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">설정</h3>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <IoCloseOutline className="text-xl text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* User List Section */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-700">
                    참가자
                  </h4>
                  <UserList />
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* Tools Section */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-700">
                    도구 설정
                  </h4>
                  <Toolbar
                    onClearCanvas={handleClearCanvas}
                    onUploadImage={handleUploadImage}
                  />
                </div>
              </div>
            </aside>
          </>
        )}
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
