import React from "react";
import { useLocationStore } from "../../store/locationStore";
import {
  FaSatellite,
  FaMapMarkerAlt,
  FaMountain,
  FaCompass,
  FaClock,
} from "react-icons/fa";

export const SatelliteInfo: React.FC = () => {
  const { selectedSatellite, userLocation, isConnected } = useLocationStore();

  if (!selectedSatellite) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-center text-gray-400 py-8">
          <FaSatellite className="text-4xl mx-auto mb-2 opacity-50" />
          <p className="text-sm">위성 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  const formatCoordinate = (value: number, isLat: boolean) => {
    const direction = isLat ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
    return `${Math.abs(value).toFixed(4)}° ${direction}`;
  };

  const formatAltitude = (altitude: number) => {
    return `${altitude.toFixed(1)} km`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Calculate distance from user to satellite ground point
  const calculateDistance = () => {
    if (!userLocation) return null;

    const R = 6371; // Earth's radius in km
    const lat1 = (userLocation.lat * Math.PI) / 180;
    const lat2 = (selectedSatellite.satlatitude * Math.PI) / 180;
    const dLat =
      ((selectedSatellite.satlatitude - userLocation.lat) * Math.PI) / 180;
    const dLng =
      ((selectedSatellite.satlongitude - userLocation.lng) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const distance = calculateDistance();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaSatellite className="text-white text-lg" />
            <h3 className="font-semibold text-white">
              {selectedSatellite.satname}
            </h3>
          </div>
          {isConnected && (
            <span className="flex items-center gap-1 text-xs text-teal-100 bg-teal-600/50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              실시간
            </span>
          )}
        </div>
        <p className="text-teal-100 text-xs mt-1">
          NORAD ID: {selectedSatellite.satid}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="p-4 space-y-3">
        {/* Position */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
              <FaMapMarkerAlt className="text-teal-500" />
              <span>위도</span>
            </div>
            <p className="font-mono text-sm font-semibold text-gray-800">
              {formatCoordinate(selectedSatellite.satlatitude, true)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
              <FaMapMarkerAlt className="text-teal-500" />
              <span>경도</span>
            </div>
            <p className="font-mono text-sm font-semibold text-gray-800">
              {formatCoordinate(selectedSatellite.satlongitude, false)}
            </p>
          </div>
        </div>

        {/* Altitude & Azimuth */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
              <FaMountain className="text-blue-500" />
              <span>고도</span>
            </div>
            <p className="font-mono text-sm font-semibold text-gray-800">
              {formatAltitude(selectedSatellite.sataltitude)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
              <FaCompass className="text-orange-500" />
              <span>방위각</span>
            </div>
            <p className="font-mono text-sm font-semibold text-gray-800">
              {selectedSatellite.azimuth.toFixed(1)}°
            </p>
          </div>
        </div>

        {/* Elevation & Distance */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
              <span className="text-purple-500">↑</span>
              <span>앙각</span>
            </div>
            <p className="font-mono text-sm font-semibold text-gray-800">
              {selectedSatellite.elevation.toFixed(1)}°
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
              <span className="text-red-500">⟷</span>
              <span>지상 거리</span>
            </div>
            <p className="font-mono text-sm font-semibold text-gray-800">
              {distance ? `${distance.toFixed(0)} km` : "-"}
            </p>
          </div>
        </div>

        {/* Last Update */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <FaClock className="text-gray-400" />
              <span>마지막 업데이트</span>
            </div>
            <p className="font-mono text-sm text-gray-600">
              {formatTimestamp(selectedSatellite.timestamp)}
            </p>
          </div>
        </div>

        {/* Visibility indicator */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-3 border border-teal-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-teal-700">가시성</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                selectedSatellite.elevation > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedSatellite.elevation > 0 ? "관측 가능" : "지평선 아래"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
