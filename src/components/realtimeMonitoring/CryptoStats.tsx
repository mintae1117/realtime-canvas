import React from "react";
import { useMonitoringStore } from "../../store/monitoringStore";
import {
  FaArrowUp,
  FaArrowDown,
  FaChartBar,
  FaCoins,
  FaExchangeAlt,
} from "react-icons/fa";

export const CryptoStats: React.FC = () => {
  const { selectedCrypto } = useMonitoringStore();

  if (!selectedCrypto) {
    return null;
  }

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    }
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  const isPositive = selectedCrypto.price_change_percentage_24h >= 0;

  return (
    <div className="space-y-3">
      {/* Current Price Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedCrypto.image}
              alt={selectedCrypto.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {selectedCrypto.name}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedCrypto.symbol.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">
              {formatPrice(selectedCrypto.current_price)}
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
              {isPositive ? (
                <FaArrowUp className="text-green-500" />
              ) : (
                <FaArrowDown className="text-red-500" />
              )}
              <span
                className={`text-sm font-semibold ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {Math.abs(selectedCrypto.price_change_percentage_24h).toFixed(
                  2
                )}
                %
              </span>
              <span className="text-xs text-gray-400 ml-1">24h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Market Cap */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FaCoins className="text-orange-500" />
            <span className="text-xs text-gray-500">시가총액</span>
          </div>
          <p className="text-lg font-bold text-gray-800">
            {formatLargeNumber(selectedCrypto.market_cap)}
          </p>
        </div>

        {/* Volume */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FaExchangeAlt className="text-blue-500" />
            <span className="text-xs text-gray-500">24시간 거래량</span>
          </div>
          <p className="text-lg font-bold text-gray-800">
            {formatLargeNumber(selectedCrypto.total_volume)}
          </p>
        </div>

        {/* 24h High */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FaChartBar className="text-green-500" />
            <span className="text-xs text-gray-500">24시간 최고가</span>
          </div>
          <p className="text-lg font-bold text-green-600">
            {formatPrice(selectedCrypto.high_24h)}
          </p>
        </div>

        {/* 24h Low */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FaChartBar className="text-red-500" />
            <span className="text-xs text-gray-500">24시간 최저가</span>
          </div>
          <p className="text-lg font-bold text-red-600">
            {formatPrice(selectedCrypto.low_24h)}
          </p>
        </div>
      </div>
    </div>
  );
};
