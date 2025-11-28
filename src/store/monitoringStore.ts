import { create } from "zustand";

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  image: string;
}

export interface PriceHistory {
  timestamp: number;
  price: number;
}

export type TimeInterval = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

export const TIME_INTERVALS: { value: TimeInterval; label: string }[] = [
  { value: "1m", label: "1분" },
  { value: "5m", label: "5분" },
  { value: "15m", label: "15분" },
  { value: "1h", label: "1시간" },
  { value: "4h", label: "4시간" },
  { value: "1d", label: "1일" },
];

interface MonitoringStore {
  // Selected crypto
  selectedCryptoId: string | null;
  selectedCrypto: CryptoData | null;

  // Price history for chart (historical data)
  priceHistory: PriceHistory[];

  // Real-time current price (latest from WebSocket)
  realtimePrice: PriceHistory | null;

  // Time interval for chart
  timeInterval: TimeInterval;

  // Available cryptos
  availableCryptos: CryptoData[];

  // Connection state
  isConnected: boolean;
  isLoading: boolean;

  // Actions
  setSelectedCryptoId: (id: string | null) => void;
  setSelectedCrypto: (crypto: CryptoData | null) => void;
  setRealtimePrice: (price: PriceHistory) => void;
  setPriceHistory: (history: PriceHistory[]) => void;
  setTimeInterval: (interval: TimeInterval) => void;
  setAvailableCryptos: (cryptos: CryptoData[]) => void;
  setIsConnected: (connected: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  resetStore: () => void;
}

export const useMonitoringStore = create<MonitoringStore>((set) => ({
  // Initial state
  selectedCryptoId: null,
  selectedCrypto: null,
  priceHistory: [],
  realtimePrice: null,
  timeInterval: "15m",
  availableCryptos: [],
  isConnected: false,
  isLoading: false,

  // Actions
  setSelectedCryptoId: (id) => set({ selectedCryptoId: id }),
  setSelectedCrypto: (crypto) => set({ selectedCrypto: crypto }),
  setRealtimePrice: (price) => set({ realtimePrice: price }),
  setPriceHistory: (history) => set({ priceHistory: history }),
  setTimeInterval: (interval) => set({ timeInterval: interval }),
  setAvailableCryptos: (cryptos) => set({ availableCryptos: cryptos }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  resetStore: () =>
    set({
      selectedCryptoId: null,
      selectedCrypto: null,
      priceHistory: [],
      realtimePrice: null,
      timeInterval: "15m",
      availableCryptos: [],
      isConnected: false,
      isLoading: false,
    }),
}));
