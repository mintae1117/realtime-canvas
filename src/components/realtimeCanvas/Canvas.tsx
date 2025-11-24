import { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Line,
  Image as KonvaImage,
  Text as KonvaText,
} from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { useCanvasStore } from "../../store/canvasStore";
import { type DrawingLine } from "../../types/canvas";
import Konva from "konva";

interface CanvasProps {
  width: number;
  height: number;
  onDrawingComplete?: (line: DrawingLine) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  onDrawingComplete,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [currentLine, setCurrentLine] = useState<number[]>([]);
  const [loadedImages, setLoadedImages] = useState<
    Map<string, HTMLImageElement>
  >(new Map());

  const {
    lines,
    images,
    texts,
    currentTool,
    strokeColor,
    strokeWidth,
    isDrawing,
    setIsDrawing,
    addLine,
    currentUser,
  } = useCanvasStore();

  // Load images
  useEffect(() => {
    images.forEach((img) => {
      setLoadedImages((prev) => {
        // Check if already loaded
        if (prev.has(img.id)) {
          return prev;
        }

        // Load new image
        const image = new window.Image();
        image.src = img.url;
        image.crossOrigin = "anonymous";
        image.onload = () => {
          setLoadedImages((current) => {
            const newMap = new Map(current);
            newMap.set(img.id, image);
            return newMap;
          });
        };

        return prev;
      });
    });
  }, [images]);

  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (currentTool === "select") return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setIsDrawing(true);
    setCurrentLine([pos.x, pos.y]);
  };

  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (!isDrawing || currentTool === "select") return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setCurrentLine((prev) => [...prev, pos.x, pos.y]);
  };

  const handleMouseUp = () => {
    if (!isDrawing || currentTool === "select" || currentLine.length < 4) {
      setIsDrawing(false);
      setCurrentLine([]);
      return;
    }

    const newLine: DrawingLine = {
      id: uuidv4(),
      tool: currentTool,
      points: currentLine,
      stroke: currentTool === "eraser" ? "#FFFFFF" : strokeColor,
      strokeWidth: currentTool === "eraser" ? strokeWidth * 3 : strokeWidth,
      userId: currentUser?.id || "anonymous",
      timestamp: Date.now(),
    };

    addLine(newLine);
    if (onDrawingComplete) {
      onDrawingComplete(newLine);
    }

    setIsDrawing(false);
    setCurrentLine([]);
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {/* Render background images */}
          {images.map((img) => {
            const image = loadedImages.get(img.id);
            return image ? (
              <KonvaImage
                key={img.id}
                image={image}
                x={img.x}
                y={img.y}
                width={img.width}
                height={img.height}
                rotation={img.rotation}
                draggable={currentTool === "select"}
              />
            ) : null;
          })}

          {/* Render all lines */}
          {lines.map((line) => (
            <Line
              key={line.id}
              points={line.points}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}

          {/* Render current drawing line */}
          {isDrawing && currentLine.length > 0 && (
            <Line
              points={currentLine}
              stroke={currentTool === "eraser" ? "#FFFFFF" : strokeColor}
              strokeWidth={
                currentTool === "eraser" ? strokeWidth * 3 : strokeWidth
              }
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                currentTool === "eraser" ? "destination-out" : "source-over"
              }
            />
          )}

          {/* Render text annotations */}
          {texts.map((text) => (
            <KonvaText
              key={text.id}
              text={text.text}
              x={text.x}
              y={text.y}
              fontSize={text.fontSize}
              fontFamily={text.fontFamily}
              fill={text.fill}
              draggable={currentTool === "select"}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};
