import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocationStore } from "../../store/locationStore";

// Custom satellite icon
const satelliteIcon = L.divIcon({
  className: "satellite-marker",
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: #ef4444;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Custom user location icon
const userIcon = L.divIcon({
  className: "user-marker",
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #22c55e;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.6);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to handle map center updates
const MapUpdater: React.FC<{ center: [number, number] | null }> = ({
  center,
}) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);

  return null;
};

export const SatelliteMap: React.FC = () => {
  const { selectedSatellite, positionHistory, userLocation, isConnected } =
    useLocationStore();

  // Convert position history to polyline coordinates
  const trailCoordinates = useMemo(() => {
    return positionHistory.map(
      (pos) => [pos.satlatitude, pos.satlongitude] as [number, number]
    );
  }, [positionHistory]);

  // Get satellite center position
  const satelliteCenter = useMemo(() => {
    if (selectedSatellite) {
      return [
        selectedSatellite.satlatitude,
        selectedSatellite.satlongitude,
      ] as [number, number];
    }
    return null;
  }, [selectedSatellite]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        minZoom={1}
        maxZoom={10}
        style={{ width: "100%", height: "100%" }}
        worldCopyJump={true}
      >
        {/* Dark theme tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Map center updater */}
        <MapUpdater center={satelliteCenter} />

        {/* Satellite trail */}
        {trailCoordinates.length > 1 && (
          <Polyline
            positions={trailCoordinates}
            pathOptions={{
              color: "#fbbf24",
              weight: 3,
              opacity: 0.7,
              dashArray: "5, 10",
            }}
          />
        )}

        {/* User location marker */}
        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={50000}
              pathOptions={{
                color: "#22c55e",
                fillColor: "#22c55e",
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>
                <div className="text-center">
                  <strong>내 위치</strong>
                  <br />
                  위도: {userLocation.lat.toFixed(4)}°
                  <br />
                  경도: {userLocation.lng.toFixed(4)}°
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Satellite marker */}
        {selectedSatellite && (
          <>
            {/* Satellite visibility circle */}
            <Circle
              center={[
                selectedSatellite.satlatitude,
                selectedSatellite.satlongitude,
              ]}
              radius={selectedSatellite.sataltitude * 1000 * 0.5}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.05,
                weight: 1,
                dashArray: "5, 5",
              }}
            />
            <Marker
              position={[
                selectedSatellite.satlatitude,
                selectedSatellite.satlongitude,
              ]}
              icon={satelliteIcon}
            >
              <Popup>
                <div className="text-center">
                  <strong>{selectedSatellite.satname}</strong>
                  <br />
                  위도: {selectedSatellite.satlatitude.toFixed(4)}°
                  <br />
                  경도: {selectedSatellite.satlongitude.toFixed(4)}°
                  <br />
                  고도: {selectedSatellite.sataltitude.toFixed(1)} km
                  {selectedSatellite.velocity && (
                    <>
                      <br />
                      속도: {selectedSatellite.velocity.toFixed(2)} km/s
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Connection line between user and satellite */}
        {userLocation && selectedSatellite && (
          <Polyline
            positions={[
              [userLocation.lat, userLocation.lng],
              [selectedSatellite.satlatitude, selectedSatellite.satlongitude],
            ]}
            pathOptions={{
              color: "white",
              weight: 1,
              opacity: 0.3,
              dashArray: "10, 10",
            }}
          />
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-xs text-white z-[1000]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
          <span>위성</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
          <span>관측 위치</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-yellow-400"></div>
          <span>궤적</span>
        </div>
      </div>

      {/* Connection Status */}
      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 z-[1000]">
        {isConnected ? (
          <span className="text-green-400 text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE
          </span>
        ) : (
          <span className="text-gray-400 text-xs">연결 대기중...</span>
        )}
      </div>
    </div>
  );
};
