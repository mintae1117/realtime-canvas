import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  type DrawingLine,
  type CanvasImage,
  type TextAnnotation,
  type DrawingTool,
  type User,
  type UserRole,
} from "../types/canvas";

interface CanvasStore {
  // Canvas state
  lines: DrawingLine[];
  images: CanvasImage[];
  texts: TextAnnotation[];

  // Drawing state
  currentTool: DrawingTool;
  strokeColor: string;
  strokeWidth: number;
  isDrawing: boolean;

  // User state
  currentUser: User | null;
  users: User[];
  roomId: string | null;

  // Actions - Drawing
  addLine: (line: DrawingLine) => void;
  removeLine: (id: string) => void;
  setLines: (lines: DrawingLine[]) => void;

  // Actions - Images
  addImage: (image: CanvasImage) => void;
  updateImage: (id: string, updates: Partial<CanvasImage>) => void;
  removeImage: (id: string) => void;
  setImages: (images: CanvasImage[]) => void;

  // Actions - Text
  addText: (text: TextAnnotation) => void;
  updateText: (id: string, updates: Partial<TextAnnotation>) => void;
  removeText: (id: string) => void;
  setTexts: (texts: TextAnnotation[]) => void;

  // Actions - Tool
  setCurrentTool: (tool: DrawingTool) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setIsDrawing: (isDrawing: boolean) => void;

  // Actions - User
  setCurrentUser: (user: User) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  setUsers: (users: User[]) => void;

  // Actions - Room
  setRoomId: (roomId: string | null) => void;

  // Actions - Canvas
  clearCanvas: () => void;
  resetStore: () => void;
}

const getRandomColor = () => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  // Initial state
  lines: [],
  images: [],
  texts: [],
  currentTool: "pen",
  strokeColor: "#000000",
  strokeWidth: 2,
  isDrawing: false,
  currentUser: null,
  users: [],
  roomId: null,

  // Drawing actions
  addLine: (line) =>
    set((state) => ({
      lines: [...state.lines, line],
    })),

  removeLine: (id) =>
    set((state) => ({
      lines: state.lines.filter((line) => line.id !== id),
    })),

  setLines: (lines) => set({ lines }),

  // Image actions
  addImage: (image) =>
    set((state) => ({
      images: [...state.images, image],
    })),

  updateImage: (id, updates) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    })),

  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),

  setImages: (images) => set({ images }),

  // Text actions
  addText: (text) =>
    set((state) => ({
      texts: [...state.texts, text],
    })),

  updateText: (id, updates) =>
    set((state) => ({
      texts: state.texts.map((txt) =>
        txt.id === id ? { ...txt, ...updates } : txt
      ),
    })),

  removeText: (id) =>
    set((state) => ({
      texts: state.texts.filter((txt) => txt.id !== id),
    })),

  setTexts: (texts) => set({ texts }),

  // Tool actions
  setCurrentTool: (tool) => set({ currentTool: tool }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),

  // User actions
  setCurrentUser: (user) => set({ currentUser: user }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users.filter((u) => u.id !== user.id), user],
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),

  updateUser: (userId, updates) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, ...updates } : u
      ),
    })),

  setUsers: (users) => set({ users }),

  // Room actions
  setRoomId: (roomId) => set({ roomId }),

  // Canvas actions
  clearCanvas: () =>
    set({
      lines: [],
      images: [],
      texts: [],
    }),

  resetStore: () =>
    set({
      lines: [],
      images: [],
      texts: [],
      currentTool: "pen",
      strokeColor: "#000000",
      strokeWidth: 2,
      isDrawing: false,
      currentUser: null,
      users: [],
      roomId: null,
    }),
}));

export const createUser = (name: string, role: UserRole): User => ({
  id: uuidv4(),
  name,
  role,
  color: getRandomColor(),
  isOnline: true,
});
