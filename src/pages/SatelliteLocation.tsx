import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  LocationSetup,
  LocationDashboard,
} from "../components/realtimeSatellite";
import { useLocationStore } from "../store/locationStore";

export function SatelliteLocation() {
  const { satelliteId: urlSatelliteId } = useParams<{ satelliteId: string }>();
  const { selectedSatelliteId, setSelectedSatelliteId, resetStore } =
    useLocationStore();

  // Sync URL satelliteId with store
  useEffect(() => {
    if (urlSatelliteId) {
      const satId = parseInt(urlSatelliteId, 10);
      if (!isNaN(satId) && satId !== selectedSatelliteId) {
        setSelectedSatelliteId(satId);
      }
    }
  }, [urlSatelliteId, selectedSatelliteId, setSelectedSatelliteId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetStore();
    };
  }, [resetStore]);

  // Show setup if no satellite selected
  if (!urlSatelliteId) {
    return <LocationSetup />;
  }

  return <LocationDashboard />;
}
