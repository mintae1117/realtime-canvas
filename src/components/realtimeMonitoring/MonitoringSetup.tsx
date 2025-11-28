import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMonitoringStore } from "../../store/monitoringStore";
import { useRealtimeCrypto } from "../../hooks/useRealtimeCrypto";
import {
  FaChartLine,
  FaLightbulb,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

export const MonitoringSetup: React.FC = () => {
  const navigate = useNavigate();
  const { availableCryptos, isLoading, setSelectedCryptoId, setPriceHistory } =
    useMonitoringStore();
  const { error, fetchCryptoList } = useRealtimeCrypto();

  useEffect(() => {
    fetchCryptoList();
  }, [fetchCryptoList]);

  const handleSelectCrypto = (cryptoId: string) => {
    setPriceHistory([]); // Clear previous history
    setSelectedCryptoId(cryptoId);
    navigate(`/monitoring/${cryptoId}`);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    }
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-5 py-6">
          <div className="text-center">
            <div className="mb-2">
              <FaChartLine className="text-4xl text-white inline-block" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">
              실시간 암호화폐 모니터링
            </h1>
            <p className="text-orange-100 text-sm">
              실시간으로 암호화폐 가격을 추적해요
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-5 py-6">
          {/* Info Box */}
          <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-orange-700 text-xs flex items-start">
              <FaLightbulb className="mr-2 mt-0.5 flex-shrink-0 text-yellow-500" />
              <span>
                모니터링할 암호화폐를 선택하면 실시간 가격 차트와 통계를 볼 수
                있어요
              </span>
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-500 text-sm">데이터 로딩 중...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => fetchCryptoList()}
                className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* Crypto List */}
          {!isLoading && !error && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                암호화폐 선택
              </p>
              <div className="grid gap-2">
                {availableCryptos.map((crypto) => (
                  <button
                    key={crypto.id}
                    onClick={() => handleSelectCrypto(crypto.id)}
                    className="w-full p-3 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-left">
                        <p className="font-semibold text-gray-800 text-sm">
                          {crypto.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {crypto.symbol.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-sm">
                        {formatPrice(crypto.current_price)}
                      </p>
                      <div className="flex items-center justify-end gap-1">
                        {crypto.price_change_percentage_24h >= 0 ? (
                          <FaArrowUp className="text-green-500 text-xs" />
                        ) : (
                          <FaArrowDown className="text-red-500 text-xs" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            crypto.price_change_percentage_24h >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {Math.abs(crypto.price_change_percentage_24h).toFixed(
                            2
                          )}
                          %
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {formatMarketCap(crypto.market_cap)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 text-center text-xs text-gray-500">
          Data provided by CoinGecko API
        </div>
      </div>
    </div>
  );
};
