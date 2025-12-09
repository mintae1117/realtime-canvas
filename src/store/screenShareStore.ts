import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface ScreenShareUser {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  isSharing: boolean;
}

interface ScreenShareStore {
  // Room state
  roomId: string | null;
  currentUser: ScreenShareUser | null;
  users: ScreenShareUser[];

  // Media state
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isSharing: boolean;

  // Connection state
  isConnected: boolean;
  isJoining: boolean;

  // Actions - Room
  setRoomId: (roomId: string | null) => void;
  setCurrentUser: (user: ScreenShareUser) => void;
  addUser: (user: ScreenShareUser) => void;
  removeUser: (userId: string) => void;
  setUsers: (users: ScreenShareUser[]) => void;
  updateUserSharing: (userId: string, isSharing: boolean) => void;

  // Actions - Media
  setLocalStream: (stream: MediaStream | null) => void;
  addRemoteStream: (userId: string, stream: MediaStream) => void;
  removeRemoteStream: (userId: string) => void;
  setIsSharing: (sharing: boolean) => void;

  // Actions - Connection
  setIsConnected: (connected: boolean) => void;
  setIsJoining: (joining: boolean) => void;

  // Actions - Reset
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

export const useScreenShareStore = create<ScreenShareStore>((set) => ({
  // Initial state
  roomId: null,
  currentUser: null,
  users: [],
  localStream: null,
  remoteStreams: new Map(),
  isSharing: false,
  isConnected: false,
  isJoining: false,

  // Room actions
  setRoomId: (roomId) => set({ roomId }),
  setCurrentUser: (user) => set({ currentUser: user }),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users.filter((u) => u.id !== user.id), user],
    })),
  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),
  setUsers: (users) => set({ users }),
  updateUserSharing: (userId, isSharing) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, isSharing } : u
      ),
    })),

  // Media actions
  setLocalStream: (stream) => set({ localStream: stream }),
  addRemoteStream: (userId, stream) =>
    set((state) => {
      const newStreams = new Map(state.remoteStreams);
      newStreams.set(userId, stream);
      return { remoteStreams: newStreams };
    }),
  removeRemoteStream: (userId) =>
    set((state) => {
      const newStreams = new Map(state.remoteStreams);
      newStreams.delete(userId);
      return { remoteStreams: newStreams };
    }),
  setIsSharing: (sharing) => set({ isSharing: sharing }),

  // Connection actions
  setIsConnected: (connected) => set({ isConnected: connected }),
  setIsJoining: (joining) => set({ isJoining: joining }),

  // Reset
  resetStore: () =>
    set({
      roomId: null,
      currentUser: null,
      users: [],
      localStream: null,
      remoteStreams: new Map(),
      isSharing: false,
      isConnected: false,
      isJoining: false,
    }),
}));

export const createScreenShareUser = (name: string): ScreenShareUser => ({
  id: uuidv4(),
  name,
  color: getRandomColor(),
  isOnline: true,
  isSharing: false,
});
