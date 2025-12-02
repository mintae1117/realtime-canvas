import { useCallback, useEffect, useRef, useState } from "react";
import {
  useLocationStore,
  type SatellitePosition,
} from "../store/locationStore";

// Where The ISS At API - Free, no API key required
// https://wheretheiss.at/w/developer
const ISS_API_BASE = "https://api.wheretheiss.at/v1/satellites";
const ISS_NORAD_ID = 25544;

export const useRealtimeSatellite = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    selectedSatelliteId,
    userLocation,
    setSelectedSatellite,
    addPositionToHistory,
    setIsConnected,
    setIsLoading,
    setUserLocation,
  } = useLocationStore();

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Seoul, Korea if geolocation fails
          setUserLocation({ lat: 37.5665, lng: 126.978 });
        }
      );
    } else {
      // Default to Seoul, Korea
      setUserLocation({ lat: 37.5665, lng: 126.978 });
    }
  }, [setUserLocation]);

  // Calculate azimuth and elevation from observer to satellite
  const calculateObserverAngles = useCallback(
    (
      satLat: number,
      satLng: number,
      satAlt: number,
      obsLat: number,
      obsLng: number
    ) => {
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const toDeg = (rad: number) => (rad * 180) / Math.PI;

      const lat1 = toRad(obsLat);
      const lat2 = toRad(satLat);
      const dLng = toRad(satLng - obsLng);

      // Azimuth calculation
      const y = Math.sin(dLng) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
      let azimuth = toDeg(Math.atan2(y, x));
      azimuth = (azimuth + 360) % 360;

      // Simple elevation approximation
      const R = 6371; // Earth radius in km
      const dLat = toRad(satLat - obsLat);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const groundDistance = R * c;

      const elevation = toDeg(Math.atan2(satAlt - 0, groundDistance));

      return { azimuth, elevation };
    },
    []
  );

  // Fetch ISS position from Where The ISS At API
  const fetchISSPosition =
    useCallback(async (): Promise<SatellitePosition | null> => {
      try {
        const response = await fetch(`${ISS_API_BASE}/${ISS_NORAD_ID}`);

        if (!response.ok) {
          throw new Error("Failed to fetch ISS position");
        }

        const data = await response.json();

        // Calculate observer angles if user location is available
        let azimuth = 0;
        let elevation = 0;

        if (userLocation) {
          const angles = calculateObserverAngles(
            data.latitude,
            data.longitude,
            data.altitude,
            userLocation.lat,
            userLocation.lng
          );
          azimuth = angles.azimuth;
          elevation = angles.elevation;
        }

        return {
          satid: data.id,
          satname: data.name,
          satlatitude: data.latitude,
          satlongitude: data.longitude,
          sataltitude: data.altitude,
          azimuth,
          elevation,
          timestamp: data.timestamp,
          velocity: data.velocity,
          visibility: data.visibility,
        };
      } catch (err) {
        console.error("Error fetching ISS position:", err);
        setError("ISS 데이터를 가져오는데 실패했습니다");
        return null;
      }
    }, [userLocation, calculateObserverAngles]);

  // Start tracking ISS
  const startTracking = useCallback(() => {
    if (!selectedSatelliteId || !userLocation) return;

    // Only track ISS (real API)
    if (selectedSatelliteId !== ISS_NORAD_ID) {
      setError("ISS만 실시간 추적이 가능합니다");
      return;
    }

    setIsLoading(true);
    setError(null);

    const updatePosition = async () => {
      const position = await fetchISSPosition();

      if (position) {
        setSelectedSatellite(position);
        addPositionToHistory(position);
        setIsConnected(true);
      }
      setIsLoading(false);
    };

    // Initial fetch
    updatePosition();

    // Update every 3 seconds
    intervalRef.current = setInterval(updatePosition, 3000);
  }, [
    selectedSatelliteId,
    userLocation,
    fetchISSPosition,
    setSelectedSatellite,
    addPositionToHistory,
    setIsConnected,
    setIsLoading,
  ]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsConnected(false);
  }, [setIsConnected]);

  // Get user location on mount
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Start/stop tracking when satellite changes
  useEffect(() => {
    if (selectedSatelliteId && userLocation) {
      startTracking();
    }

    return () => {
      stopTracking();
    };
  }, [selectedSatelliteId, userLocation, startTracking, stopTracking]);

  return {
    error,
    startTracking,
    stopTracking,
    getUserLocation,
  };
};
