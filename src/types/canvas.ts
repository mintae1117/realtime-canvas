export type DrawingTool = "pen" | "eraser" | "select" | "text";

export interface Point {
  x: number;
  y: number;
}

export interface DrawingLine {
  id: string;
  tool: DrawingTool;
  points: number[];
  stroke: string;
  strokeWidth: number;
  userId: string;
  timestamp: number;
}

export interface CanvasImage {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  userId: string;
  timestamp: number;
}

export interface TextAnnotation {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  userId: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
}

export interface Room {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
}

export interface CanvasState {
  lines: DrawingLine[];
  images: CanvasImage[];
  texts: TextAnnotation[];
}

export type RealtimeDrawingEvent =
  | { type: "line-add"; data: DrawingLine }
  | { type: "line-remove"; data: { id: string } }
  | { type: "image-add"; data: CanvasImage }
  | { type: "image-update"; data: CanvasImage }
  | { type: "image-remove"; data: { id: string } }
  | { type: "text-add"; data: TextAnnotation }
  | { type: "text-update"; data: TextAnnotation }
  | { type: "text-remove"; data: { id: string } }
  | { type: "clear-canvas"; data: { userId: string } };
