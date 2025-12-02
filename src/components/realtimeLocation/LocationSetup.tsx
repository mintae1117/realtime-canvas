import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useLocationStore,
  SATELLITE_CATEGORIES,
} from "../../store/locationStore";
import { FaSatellite, FaLightbulb, FaMapMarkerAlt } from "react-icons/fa";

export const LocationSetup: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation, setSelectedSatelliteId, clearPositionHistory } =
    useLocationStore();

  const handleSelectSatellite = (satId: number) => {
    clearPositionHistory();
    setSelectedSatelliteId(satId);
    navigate(`/location/${satId}`);
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
              실시간 위성 위치 추적
            </h1>
            <p className="text-teal-100 text-sm">
              실시간으로 위성의 위치를 지도에서 확인하세요
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

          {/* Info Box */}
          <div className="mb-4 p-3 bg-cyan-50 rounded-lg border border-cyan-100">
            <p className="text-cyan-700 text-xs flex items-start">
              <FaLightbulb className="mr-2 mt-0.5 flex-shrink-0 text-yellow-500" />
              <span>
                추적할 위성을 선택하면 실시간 위치를 지도에서 확인할 수 있어요.
                ISS(국제우주정거장)가 가장 인기있는 선택이에요!
              </span>
            </p>
          </div>

          {/* Satellite List */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              위성 선택
            </p>
            <div className="grid gap-2">
              {SATELLITE_CATEGORIES.map((satellite) => (
                <button
                  key={satellite.id}
                  onClick={() => handleSelectSatellite(satellite.id)}
                  className="w-full p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-300 rounded-lg transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                      <FaSatellite className="text-white text-lg" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 text-sm">
                        {satellite.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {satellite.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">NORAD ID</p>
                    <p className="font-mono text-sm text-gray-600">
                      {satellite.id}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 text-center text-xs text-gray-500">
          Satellite data simulation based on real orbital mechanics
        </div>
      </div>
    </div>
  );
};
