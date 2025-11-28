import React from "react";
import { useNavigate } from "react-router-dom";
import { useMonitoringStore } from "../../store/monitoringStore";
import { useRealtimeCrypto } from "../../hooks/useRealtimeCrypto";
import { CryptoChart } from "./CryptoChart";
import { CryptoStats } from "./CryptoStats";
import { FaArrowLeft } from "react-icons/fa";

export const MonitoringDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedCrypto,
    selectedCryptoId,
    availableCryptos,
    setSelectedCryptoId,
    setPriceHistory,
  } = useMonitoringStore();
  const { error } = useRealtimeCrypto();

  const handleBack = () => {
    setSelectedCryptoId(null);
    setPriceHistory([]);
    navigate("/monitoring");
  };

  const handleChangeCrypto = (cryptoId: string) => {
    setPriceHistory([]);
    setSelectedCryptoId(cryptoId);
    navigate(`/monitoring/${cryptoId}`);
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 p-4 pb-20 md:pb-4 md:pl-20">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">실시간 모니터링</h1>
          </div>

          {/* Crypto Selector */}
          <div className="flex items-center gap-2">
            {selectedCrypto && (
              <img
                src={selectedCrypto.image}
                alt={selectedCrypto.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            <select
              value={selectedCryptoId || ""}
              onChange={(e) => handleChangeCrypto(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {availableCryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Stats */}
          <CryptoStats />

          {/* Chart */}
          <CryptoChart />
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Data provided by Binance API
        </div>
      </div>
    </div>
  );
};
