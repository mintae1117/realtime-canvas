import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface LocationUser {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  lastUpdated: number | null;
}

interface RealtimeLocationStore {
  // Room state
  roomId: string | null;
  currentUser: LocationUser | null;
  users: LocationUser[];

  // Location state
  isWatching: boolean;
  watchId: number | null;
  locationError: string | null;

  // Connection state
  isConnected: boolean;
  isJoining: boolean;

  // Actions - Room
  setRoomId: (roomId: string | null) => void;
  setCurrentUser: (user: LocationUser) => void;
  updateCurrentUserLocation: (location: {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    heading: number | null;
    speed: number | null;
  }) => void;
  addUser: (user: LocationUser) => void;
  removeUser: (userId: string) => void;
  updateUserLocation: (
    userId: string,
    location: {
      latitude: number;
      longitude: number;
      accuracy: number | null;
      heading: number | null;
      speed: number | null;
      lastUpdated: number;
    }
  ) => void;
  setUsers: (users: LocationUser[]) => void;

  // Actions - Location
  setIsWatching: (watching: boolean) => void;
  setWatchId: (id: number | null) => void;
  setLocationError: (error: string | null) => void;

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
    "#F1948A",
    "#82E0AA",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useRealtimeLocationStore = create<RealtimeLocationStore>(
  (set) => ({
    // Initial state
    roomId: null,
    currentUser: null,
    users: [],
    isWatching: false,
    watchId: null,
    locationError: null,
    isConnected: false,
    isJoining: false,

    // Room actions
    setRoomId: (roomId) => set({ roomId }),
    setCurrentUser: (user) => set({ currentUser: user }),
    updateCurrentUserLocation: (location) =>
      set((state) => ({
        currentUser: state.currentUser
          ? {
              ...state.currentUser,
              latitude: location.latitude,
              longitude: location.longitude,
              accuracy: location.accuracy,
              heading: location.heading,
              speed: location.speed,
              lastUpdated: Date.now(),
            }
          : null,
      })),
    addUser: (user) =>
      set((state) => ({
        users: [...state.users.filter((u) => u.id !== user.id), user],
      })),
    removeUser: (userId) =>
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
      })),
    updateUserLocation: (userId, location) =>
      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId
            ? {
                ...u,
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy,
                heading: location.heading,
                speed: location.speed,
                lastUpdated: location.lastUpdated,
              }
            : u
        ),
      })),
    setUsers: (users) => set({ users }),

    // Location actions
    setIsWatching: (watching) => set({ isWatching: watching }),
    setWatchId: (id) => set({ watchId: id }),
    setLocationError: (error) => set({ locationError: error }),

    // Connection actions
    setIsConnected: (connected) => set({ isConnected: connected }),
    setIsJoining: (joining) => set({ isJoining: joining }),

    // Reset
    resetStore: () =>
      set({
        roomId: null,
        currentUser: null,
        users: [],
        isWatching: false,
        watchId: null,
        locationError: null,
        isConnected: false,
        isJoining: false,
      }),
  })
);

export const createLocationUser = (name: string): LocationUser => ({
  id: uuidv4(),
  name,
  color: getRandomColor(),
  isOnline: true,
  latitude: null,
  longitude: null,
  accuracy: null,
  heading: null,
  speed: null,
  lastUpdated: null,
});
