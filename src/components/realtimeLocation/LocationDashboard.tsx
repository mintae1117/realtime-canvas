import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocationStore, ISS_SATELLITE } from "../../store/locationStore";
import { useRealtimeSatellite } from "../../hooks/useRealtimeSatellite";
import { SatelliteMap } from "./SatelliteMap";
import { SatelliteInfo } from "./SatelliteInfo";
import {
  FaArrowLeft,
  FaSatellite,
  FaMapMarkerAlt,
  FaHistory,
  FaCheckCircle,
} from "react-icons/fa";

export const LocationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
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
                {ISS_SATELLITE.name}
                <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1">
                  <FaCheckCircle className="text-xs" />
                  LIVE API
                </span>
              </h1>
              <p className="text-gray-400 text-sm">
                {ISS_SATELLITE.description}
              </p>
            </div>
          </div>

          {/* API Source Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">
              wheretheiss.at API
            </span>
          </div>
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

            {/* Velocity Info */}
            {selectedSatellite?.velocity && (
              <div className="mt-3 p-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-lg border border-teal-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-teal-400 text-sm">현재 속도</span>
                  <span className="text-white font-mono font-bold">
                    {selectedSatellite.velocity.toFixed(2)} km/s (
                    {(selectedSatellite.velocity * 3600).toFixed(0)} km/h)
                  </span>
                </div>
              </div>
            )}
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

            {/* Real API Info */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                실제 API 데이터
              </h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Where The ISS At API 실시간 연동</li>
                <li>• 3초마다 실제 위성 위치 업데이트</li>
                <li>• 시뮬레이션 아닌 실제 궤도 데이터</li>
                <li>• API 키 불필요 (무료)</li>
              </ul>
            </div>

            {/* ISS Facts */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
              <h4 className="text-sm font-semibold text-teal-800 mb-2">
                ISS 정보
              </h4>
              <ul className="text-xs text-teal-700 space-y-1">
                <li>• 약 92분에 지구를 한 바퀴 돕니다</li>
                <li>• 하루에 약 16번의 일출과 일몰을 경험</li>
                <li>• 앙각이 0° 이상이면 관측 가능</li>
                <li>• 1998년부터 운영 중</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
