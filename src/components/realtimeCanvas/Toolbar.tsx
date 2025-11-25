import React from "react";
import { useCanvasStore } from "../../store/canvasStore";
import { type DrawingTool } from "../../types/canvas";

interface ToolbarProps {
  onClearCanvas?: () => void;
  onUploadImage?: () => void;
  compact?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onClearCanvas,
  onUploadImage,
  compact = false,
}) => {
  const {
    currentTool,
    strokeColor,
    strokeWidth,
    setCurrentTool,
    setStrokeColor,
    setStrokeWidth,
  } = useCanvasStore();

  const tools: Array<{ value: DrawingTool; label: string; icon: string }> = [
    { value: "pen", label: "펜", icon: "✏️" },
    { value: "eraser", label: "지우개", icon: "🧹" },
    { value: "select", label: "선택", icon: "👆" },
    { value: "text", label: "텍스트", icon: "📝" },
  ];

  const colors = [
    { value: "#000000", label: "검정" },
    { value: "#FF0000", label: "빨강" },
    { value: "#0000FF", label: "파랑" },
    { value: "#00FF00", label: "초록" },
    { value: "#FFFF00", label: "노랑" },
    { value: "#FF00FF", label: "자홍" },
    { value: "#00FFFF", label: "청록" },
    { value: "#FFA500", label: "주황" },
  ];

  const strokeWidths = [
    { value: 1, label: "S" },
    { value: 2, label: "M" },
    { value: 4, label: "L" },
    { value: 8, label: "XL" },
  ];

  // Compact version for sidebar
  if (compact) {
    return (
      <div className="space-y-3">
        {/* Tools */}
        <div>
          <h4 className="text-xs font-semibold mb-1.5 text-gray-500 uppercase tracking-wide">
            도구
          </h4>
          <div className="grid grid-cols-4 gap-1">
            {tools.map((tool) => (
              <button
                key={tool.value}
                onClick={() => setCurrentTool(tool.value)}
                className={`p-1.5 rounded text-sm transition-all ${
                  currentTool === tool.value
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                title={tool.label}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        {currentTool !== "eraser" && currentTool !== "select" && (
          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-700">색상</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setStrokeColor(color.value)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    strokeColor === color.value
                      ? "ring-4 ring-blue-500 scale-110"
                      : "ring-2 ring-gray-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stroke Width */}
        {currentTool !== "select" && (
          <div>
            <h4 className="text-xs font-semibold mb-1.5 text-gray-500 uppercase tracking-wide">
              {currentTool === "eraser" ? "크기" : "굵기"}
            </h4>
            <div className="flex gap-1">
              {strokeWidths.map((width) => (
                <button
                  key={width.value}
                  onClick={() => setStrokeWidth(width.value)}
                  className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                    strokeWidth === width.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {width.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-1 pt-2 border-t border-gray-100">
          <button
            onClick={onUploadImage}
            className="flex-1 p-1.5 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
            title="이미지 업로드"
          >
            📷
          </button>
          <button
            onClick={onClearCanvas}
            className="flex-1 p-1.5 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
            title="전체 지우기"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  }

  // Full version (for mobile bottom bar or standalone)
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      {/* Tools */}
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">도구</h3>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.value}
              onClick={() => setCurrentTool(tool.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentTool === tool.value
                  ? "bg-blue-500 text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-2">{tool.icon}</span>
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      {currentTool !== "eraser" && currentTool !== "select" && (
        <div>
          <h3 className="text-sm font-semibold mb-2 text-gray-700">색상</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setStrokeColor(color.value)}
                className={`w-8 h-8 rounded-full transition-all ${
                  strokeColor === color.value
                    ? "ring-4 ring-blue-500 scale-110"
                    : "ring-2 ring-gray-300 hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stroke Width */}
      {currentTool !== "select" && (
        <div>
          <h3 className="text-sm font-semibold mb-2 text-gray-700">
            {currentTool === "eraser" ? "지우개 크기" : "선 굵기"}
          </h3>
          <div className="space-y-2">
            {strokeWidths.map((width) => (
              <button
                key={width.value}
                onClick={() => setStrokeWidth(width.value)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center ${
                  strokeWidth === width.value
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div
                  className="mr-3 rounded-full bg-current"
                  style={{
                    width: `${width.value * 2}px`,
                    height: `${width.value * 2}px`,
                  }}
                />
                {width.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <button
          onClick={onUploadImage}
          className="w-full px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          <span className="mr-2">📷</span>
          이미지 업로드
        </button>
        <button
          onClick={onClearCanvas}
          className="w-full px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
        >
          <span className="mr-2">🗑️</span>
          전체 지우기
        </button>
      </div>
    </div>
  );
};
