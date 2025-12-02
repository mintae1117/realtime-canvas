import { useCallback, useEffect, useRef, useState } from "react";
import {
  useLocationStore,
  type SatellitePosition,
} from "../store/locationStore";

// N2YO API - Free tier allows 1000 requests/hour
// For demo purposes, we'll simulate with realistic data
const DEMO_MODE = true; // Set to false when you have an API key
const N2YO_API_KEY = "YOUR_API_KEY_HERE";

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

  // Simulate realistic satellite position for demo
  const simulateSatellitePosition = useCallback(
    (satId: number): SatellitePosition => {
      const now = Date.now();
      // ISS orbits Earth every ~92 minutes at ~7.66 km/s
      // Generate realistic orbital movement
      const orbitalPeriod = 92 * 60 * 1000; // 92 minutes in ms
      const progress = (now % orbitalPeriod) / orbitalPeriod;

      // Simulate orbital path with inclination
      const inclination = 51.6; // ISS inclination in degrees
      const longitude = ((progress * 360 - 180) % 360) - 180;
      const latitude = Math.sin(progress * Math.PI * 2) * inclination;

      // Add some variation based on satellite ID
      const latOffset = (satId % 10) * 0.5;
      const lngOffset = (satId % 7) * 2;

      const satelliteNames: Record<number, string> = {
        25544: "ISS (ZARYA)",
        48274: "CSS (TIANHE)",
        20580: "Hubble Space Telescope",
        43013: "Starlink-24",
        25994: "Terra",
        27424: "Aqua",
        33591: "NOAA 19",
        41866: "GOES 16",
      };

      return {
        satid: satId,
        satname: satelliteNames[satId] || `Satellite ${satId}`,
        satlatitude: latitude + latOffset,
        satlongitude: longitude + lngOffset,
        sataltitude: 408 + (satId % 100), // ~408km for ISS
        azimuth: (progress * 360) % 360,
        elevation: 45 + Math.sin(progress * Math.PI * 4) * 30,
        ra: (progress * 24) % 24,
        dec: latitude,
        timestamp: Math.floor(now / 1000),
      };
    },
    []
  );

  // Fetch satellite position from N2YO API
  const fetchSatellitePosition = useCallback(
    async (satId: number, obsLat: number, obsLng: number) => {
      if (DEMO_MODE) {
        return simulateSatellitePosition(satId);
      }

      try {
        const response = await fetch(
          `https://api.n2yo.com/rest/v1/satellite/positions/${satId}/${obsLat}/${obsLng}/0/1/&apiKey=${N2YO_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch satellite position");
        }

        const data = await response.json();
        if (data.positions && data.positions.length > 0) {
          const pos = data.positions[0];
          return {
            satid: data.info.satid,
            satname: data.info.satname,
            satlatitude: pos.satlatitude,
            satlongitude: pos.satlongitude,
            sataltitude: pos.sataltitude,
            azimuth: pos.azimuth,
            elevation: pos.elevation,
            ra: pos.ra,
            dec: pos.dec,
            timestamp: pos.timestamp,
          } as SatellitePosition;
        }
        return null;
      } catch (err) {
        console.error("Error fetching satellite position:", err);
        // Fallback to simulation on error
        return simulateSatellitePosition(satId);
      }
    },
    [simulateSatellitePosition]
  );

  // Start tracking satellite
  const startTracking = useCallback(() => {
    if (!selectedSatelliteId || !userLocation) return;

    setIsLoading(true);
    setError(null);

    const updatePosition = async () => {
      const position = await fetchSatellitePosition(
        selectedSatelliteId,
        userLocation.lat,
        userLocation.lng
      );

      if (position) {
        setSelectedSatellite(position);
        addPositionToHistory(position);
        setIsConnected(true);
      }
      setIsLoading(false);
    };

    // Initial fetch
    updatePosition();

    // Update every 2 seconds
    intervalRef.current = setInterval(updatePosition, 2000);
  }, [
    selectedSatelliteId,
    userLocation,
    fetchSatellitePosition,
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
