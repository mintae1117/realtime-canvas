import { useEffect, useRef, useCallback, useState } from "react";
import {
  useMonitoringStore,
  type CryptoData,
  type TimeInterval,
} from "../store/monitoringStore";

// Binance WebSocket API (무료, rate limit 없음, 실시간 스트리밍)
const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws";
const BINANCE_REST_URL = "https://api.binance.com/api/v3";

// 지원하는 암호화폐 목록 (Binance 심볼)
export const SUPPORTED_CRYPTOS = [
  {
    id: "btcusdt",
    symbol: "BTC",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  },
  {
    id: "ethusdt",
    symbol: "ETH",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    id: "xrpusdt",
    symbol: "XRP",
    name: "XRP",
    image:
      "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
  },
  {
    id: "adausdt",
    symbol: "ADA",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  },
  {
    id: "solusdt",
    symbol: "SOL",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  },
  {
    id: "dogeusdt",
    symbol: "DOGE",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
  },
  {
    id: "dotusdt",
    symbol: "DOT",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
  },
  {
    id: "avaxusdt",
    symbol: "AVAX",
    name: "Avalanche",
    image:
      "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  },
];

interface BinanceTicker {
  e: string; // Event type
  s: string; // Symbol
  c: string; // Close price
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Volume
  q: string; // Quote volume
  P: string; // Price change percent
}

export const useRealtimeCrypto = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    selectedCryptoId,
    timeInterval,
    setSelectedCrypto,
    setRealtimePrice,
    setPriceHistory,
    setAvailableCryptos,
    setIsConnected,
    setIsLoading,
  } = useMonitoringStore();

  // 시간 간격별 데이터 개수 설정
  const getIntervalConfig = (interval: TimeInterval) => {
    switch (interval) {
      case "1m":
        return { limit: 60 }; // 1시간치 (60개)
      case "5m":
        return { limit: 72 }; // 6시간치 (72개)
      case "15m":
        return { limit: 96 }; // 24시간치 (96개)
      case "1h":
        return { limit: 72 }; // 3일치 (72개)
      case "4h":
        return { limit: 90 }; // 15일치 (90개)
      case "1d":
        return { limit: 90 }; // 3개월치 (90개)
      default:
        return { limit: 96 };
    }
  };

  // Fetch 24hr ticker for all cryptos (initial load)
  const fetchCryptoList = useCallback(async () => {
    try {
      setIsLoading(true);
      const symbols = SUPPORTED_CRYPTOS.map((c) => c.id.toUpperCase());

      const responses = await Promise.all(
        symbols.map((symbol) =>
          fetch(`${BINANCE_REST_URL}/ticker/24hr?symbol=${symbol}`)
            .then((res) => res.json())
            .catch(() => null)
        )
      );

      const cryptos: CryptoData[] = responses
        .map((data, index) => {
          if (!data || data.code) return null;
          const cryptoInfo = SUPPORTED_CRYPTOS[index];
          return {
            id: cryptoInfo.id,
            symbol: cryptoInfo.symbol,
            name: cryptoInfo.name,
            current_price: parseFloat(data.lastPrice),
            price_change_percentage_24h: parseFloat(data.priceChangePercent),
            market_cap:
              parseFloat(data.quoteVolume) * parseFloat(data.lastPrice),
            total_volume: parseFloat(data.quoteVolume),
            high_24h: parseFloat(data.highPrice),
            low_24h: parseFloat(data.lowPrice),
            image: cryptoInfo.image,
          };
        })
        .filter((c): c is CryptoData => c !== null);

      setAvailableCryptos(cryptos);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [setAvailableCryptos, setIsLoading]);

  // Fetch kline/candlestick data for chart
  const fetchPriceHistory = useCallback(async () => {
    if (!selectedCryptoId) return;

    try {
      setIsLoading(true);
      const symbol = selectedCryptoId.toUpperCase();
      const { limit } = getIntervalConfig(timeInterval);
      const response = await fetch(
        `${BINANCE_REST_URL}/klines?symbol=${symbol}&interval=${timeInterval}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch price history");
      }

      const data = await response.json();
      const history = data.map((kline: (string | number)[]) => ({
        timestamp: kline[0] as number,
        price: parseFloat(kline[4] as string), // Close price
      }));

      setPriceHistory(history);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch history");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCryptoId, timeInterval, setPriceHistory, setIsLoading]);

  // Connect to WebSocket for real-time ticker updates
  const connectWebSocket = useCallback(() => {
    if (!selectedCryptoId) return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const symbol = selectedCryptoId.toLowerCase();
    const ws = new WebSocket(`${BINANCE_WS_URL}/${symbol}@ticker`);

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data: BinanceTicker = JSON.parse(event.data);
        const cryptoInfo = SUPPORTED_CRYPTOS.find(
          (c) => c.id === selectedCryptoId
        );

        if (cryptoInfo) {
          const updatedCrypto: CryptoData = {
            id: cryptoInfo.id,
            symbol: cryptoInfo.symbol,
            name: cryptoInfo.name,
            current_price: parseFloat(data.c),
            price_change_percentage_24h: parseFloat(data.P),
            market_cap: parseFloat(data.q) * parseFloat(data.c),
            total_volume: parseFloat(data.q),
            high_24h: parseFloat(data.h),
            low_24h: parseFloat(data.l),
            image: cryptoInfo.image,
          };

          setSelectedCrypto(updatedCrypto);

          // Update realtime price (for chart's latest point)
          setRealtimePrice({
            timestamp: Date.now(),
            price: parseFloat(data.c),
          });
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };

    ws.onerror = () => {
      setError("WebSocket connection error");
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    wsRef.current = ws;
  }, [selectedCryptoId, setSelectedCrypto, setRealtimePrice, setIsConnected]);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, [setIsConnected]);

  // Initialize crypto list on mount
  useEffect(() => {
    fetchCryptoList();
  }, [fetchCryptoList]);

  // Connect WebSocket when crypto is selected
  useEffect(() => {
    if (selectedCryptoId) {
      fetchPriceHistory();
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [
    selectedCryptoId,
    fetchPriceHistory,
    connectWebSocket,
    disconnectWebSocket,
  ]);

  return {
    error,
    fetchCryptoList,
    fetchPriceHistory,
    connectWebSocket,
    disconnectWebSocket,
  };
};
