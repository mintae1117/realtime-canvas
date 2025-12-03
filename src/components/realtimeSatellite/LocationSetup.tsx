import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocationStore, ISS_SATELLITE } from "../../store/locationStore";
import {
  FaSatellite,
  FaLightbulb,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

export const LocationSetup: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation, setSelectedSatelliteId, clearPositionHistory } =
    useLocationStore();

  const handleSelectISS = () => {
    clearPositionHistory();
    setSelectedSatelliteId(ISS_SATELLITE.id);
    navigate(`/satellite/${ISS_SATELLITE.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-100 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-5 py-6">
          <div className="text-center">
            <div className="mb-2">
              <FaSatellite className="text-4xl text-white inline-block" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">
              실시간 ISS 위치 추적
            </h1>
            <p className="text-teal-100 text-sm">
              국제우주정거장의 실시간 위치를 지도에서 확인하세요
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-5 py-6">
          {/* User Location Info */}
          {userLocation && (
            <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
              <p className="text-teal-700 text-xs flex items-center">
                <FaMapMarkerAlt className="mr-2 text-teal-500" />
                <span>
                  현재 관측 위치: {userLocation.lat.toFixed(4)}°N,{" "}
                  {userLocation.lng.toFixed(4)}°E
                </span>
              </p>
            </div>
          )}

          {/* Real API Badge */}
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-700 text-xs flex items-center">
              <FaCheckCircle className="mr-2 text-green-500" />
              <span>
                <strong>실제 API 데이터</strong> - Where The ISS At API를 통해
                실시간 위성 데이터를 제공합니다
              </span>
            </p>
          </div>

          {/* Info Box */}
          <div className="mb-4 p-3 bg-cyan-50 rounded-lg border border-cyan-100">
            <p className="text-cyan-700 text-xs flex items-start">
              <FaLightbulb className="mr-2 mt-0.5 flex-shrink-0 text-yellow-500" />
              <span>
                ISS(국제우주정거장)는 지구 상공 약 408km에서 시속 27,600km로
                비행하며, 약 92분에 지구를 한 바퀴 돕니다.
              </span>
            </p>
          </div>

          {/* ISS Card */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              추적 가능한 위성
            </p>
            <button
              onClick={handleSelectISS}
              className="w-full p-4 bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 border-2 border-teal-300 hover:border-teal-400 rounded-xl transition-all flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaSatellite className="text-white text-2xl" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800 text-lg">
                      {ISS_SATELLITE.name}
                    </p>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      LIVE
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {ISS_SATELLITE.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">NORAD ID</p>
                <p className="font-mono text-lg font-bold text-teal-600">
                  {ISS_SATELLITE.id}
                </p>
              </div>
            </button>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-teal-600">3초</p>
              <p className="text-xs text-gray-500">업데이트 주기</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-teal-600">408km</p>
              <p className="text-xs text-gray-500">평균 고도</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-teal-600">7.66km/s</p>
              <p className="text-xs text-gray-500">궤도 속도</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 text-center text-xs text-gray-500">
          Data provided by{" "}
          <a
            href="https://wheretheiss.at"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            Where The ISS At API
          </a>{" "}
          - Real-time satellite tracking
        </div>
      </div>
    </div>
  );
};
