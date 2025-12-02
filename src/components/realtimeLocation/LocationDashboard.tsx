import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useLocationStore,
  SATELLITE_CATEGORIES,
} from "../../store/locationStore";
import { useRealtimeSatellite } from "../../hooks/useRealtimeSatellite";
import { SatelliteMap } from "./SatelliteMap";
import { SatelliteInfo } from "./SatelliteInfo";
import {
  FaArrowLeft,
  FaSatellite,
  FaMapMarkerAlt,
  FaHistory,
} from "react-icons/fa";

export const LocationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedSatelliteId,
    selectedSatellite,
    positionHistory,
    userLocation,
    isConnected,
    isLoading,
  } = useLocationStore();

  // Initialize satellite tracking
  useRealtimeSatellite();

  const handleBack = () => {
    navigate("/location");
  };

  const handleChangeSatellite = (satId: number) => {
    navigate(`/location/${satId}`);
  };

  const currentSatelliteInfo = SATELLITE_CATEGORIES.find(
    (s) => s.id === selectedSatelliteId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-4 pb-20 md:pb-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <FaSatellite className="text-teal-400" />
                {currentSatelliteInfo?.name || "위성 추적"}
              </h1>
              <p className="text-gray-400 text-sm">
                {currentSatelliteInfo?.description}
              </p>
            </div>
          </div>

          {/* Satellite Selector */}
          <select
            value={selectedSatelliteId || ""}
            onChange={(e) => handleChangeSatellite(Number(e.target.value))}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-teal-400"
          >
            {SATELLITE_CATEGORIES.map((sat) => (
              <option key={sat.id} value={sat.id} className="bg-gray-800">
                {sat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
              <div className="aspect-[2/1] min-h-[300px]">
                <SatelliteMap />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <FaMapMarkerAlt className="text-teal-400" />
                  현재 위치
                </div>
                <p className="text-white font-mono text-sm">
                  {selectedSatellite
                    ? `${selectedSatellite.satlatitude.toFixed(2)}°, ${selectedSatellite.satlongitude.toFixed(2)}°`
                    : "-"}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <span className="text-blue-400">↑</span>
                  고도
                </div>
                <p className="text-white font-mono text-sm">
                  {selectedSatellite
                    ? `${selectedSatellite.sataltitude.toFixed(1)} km`
                    : "-"}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <FaHistory className="text-yellow-400" />
                  추적 포인트
                </div>
                <p className="text-white font-mono text-sm">
                  {positionHistory.length}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400 animate-pulse" : "bg-gray-500"}`}
                  ></span>
                  상태
                </div>
                <p
                  className={`font-medium text-sm ${isConnected ? "text-green-400" : "text-gray-400"}`}
                >
                  {isLoading
                    ? "연결 중..."
                    : isConnected
                      ? "실시간 추적"
                      : "대기"}
                </p>
              </div>
            </div>
          </div>

          {/* Satellite Info Panel */}
          <div className="space-y-4">
            <SatelliteInfo />

            {/* Observer Location */}
            {userLocation && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-500" />
                  관측 위치
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">위도</p>
                    <p className="font-mono text-sm text-gray-800">
                      {userLocation.lat.toFixed(4)}° N
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">경도</p>
                    <p className="font-mono text-sm text-gray-800">
                      {userLocation.lng.toFixed(4)}° E
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
              <h4 className="text-sm font-semibold text-teal-800 mb-2">
                실시간 위성 추적
              </h4>
              <ul className="text-xs text-teal-700 space-y-1">
                <li>• 위성 위치가 2초마다 업데이트됩니다</li>
                <li>• 노란색 궤적은 최근 이동 경로입니다</li>
                <li>• ISS는 약 92분에 지구를 한 바퀴 돕니다</li>
                <li>• 앙각이 0° 이상이면 육안 관측이 가능할 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
