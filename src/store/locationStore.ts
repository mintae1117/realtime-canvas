import { create } from "zustand";

export interface Satellite {
  satid: number;
  satname: string;
  intDesignator: string;
  launchDate: string;
  satlat: number;
  satlng: number;
  satalt: number;
}

export interface SatellitePosition {
  satid: number;
  satname: string;
  satlatitude: number;
  satlongitude: number;
  sataltitude: number;
  azimuth: number;
  elevation: number;
  timestamp: number;
  velocity?: number;
  visibility?: string;
}

export interface SatelliteCategory {
  id: number;
  name: string;
  description: string;
}

// ISS - Real API data from Where The ISS At
export const ISS_SATELLITE = {
  id: 25544,
  name: "ISS (ZARYA)",
  description: "International Space Station - 실시간 API 데이터",
};

interface LocationStore {
  // Selected satellite
  selectedSatelliteId: number | null;
  selectedSatellite: SatellitePosition | null;

  // Position history for tracking
  positionHistory: SatellitePosition[];

  // User's location for observer position
  userLocation: { lat: number; lng: number } | null;

  // Connection state
  isConnected: boolean;
  isLoading: boolean;

  // Actions
  setSelectedSatelliteId: (id: number | null) => void;
  setSelectedSatellite: (satellite: SatellitePosition | null) => void;
  addPositionToHistory: (position: SatellitePosition) => void;
  clearPositionHistory: () => void;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
  setIsConnected: (connected: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  resetStore: () => void;
}

const MAX_HISTORY_SIZE = 100;

export const useLocationStore = create<LocationStore>((set) => ({
  // Initial state
  selectedSatelliteId: null,
  selectedSatellite: null,
  positionHistory: [],
  userLocation: null,
  isConnected: false,
  isLoading: false,

  // Actions
  setSelectedSatelliteId: (id) => set({ selectedSatelliteId: id }),
  setSelectedSatellite: (satellite) => set({ selectedSatellite: satellite }),
  addPositionToHistory: (position) =>
    set((state) => {
      const newHistory = [...state.positionHistory, position];
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return { positionHistory: newHistory.slice(-MAX_HISTORY_SIZE) };
      }
      return { positionHistory: newHistory };
    }),
  clearPositionHistory: () => set({ positionHistory: [] }),
  setUserLocation: (location) => set({ userLocation: location }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  resetStore: () =>
    set({
      selectedSatelliteId: null,
      selectedSatellite: null,
      positionHistory: [],
      userLocation: null,
      isConnected: false,
      isLoading: false,
    }),
}));
