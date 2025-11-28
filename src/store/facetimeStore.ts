import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface FacetimeUser {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
}

export interface PeerConnection {
  oduderId: string;
  stream: MediaStream | null;
  connection: RTCPeerConnection | null;
}

interface FacetimeStore {
  // Room state
  roomId: string | null;
  currentUser: FacetimeUser | null;
  users: FacetimeUser[];

  // Media state
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;

  // Connection state
  isConnected: boolean;
  isJoining: boolean;

  // Actions - Room
  setRoomId: (roomId: string | null) => void;
  setCurrentUser: (user: FacetimeUser) => void;
  addUser: (user: FacetimeUser) => void;
  removeUser: (userId: string) => void;
  setUsers: (users: FacetimeUser[]) => void;

  // Actions - Media
  setLocalStream: (stream: MediaStream | null) => void;
  addRemoteStream: (userId: string, stream: MediaStream) => void;
  removeRemoteStream: (userId: string) => void;
  setVideoEnabled: (enabled: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;

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

export const useFacetimeStore = create<FacetimeStore>((set) => ({
  // Initial state
  roomId: null,
  currentUser: null,
  users: [],
  localStream: null,
  remoteStreams: new Map(),
  isVideoEnabled: true,
  isAudioEnabled: true,
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
  setVideoEnabled: (enabled) => set({ isVideoEnabled: enabled }),
  setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),

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
      isVideoEnabled: true,
      isAudioEnabled: true,
      isConnected: false,
      isJoining: false,
    }),
}));

export const createFacetimeUser = (name: string): FacetimeUser => ({
  id: uuidv4(),
  name,
  color: getRandomColor(),
  isOnline: true,
});
