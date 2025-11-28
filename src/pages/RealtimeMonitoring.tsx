import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  MonitoringSetup,
  MonitoringDashboard,
} from "../components/realtimeMonitoring";
import { useMonitoringStore } from "../store/monitoringStore";

export function RealtimeMonitoring() {
  const { cryptoId: urlCryptoId } = useParams<{ cryptoId: string }>();
  const { selectedCryptoId, setSelectedCryptoId, resetStore } =
    useMonitoringStore();

  // Sync URL cryptoId with store
  useEffect(() => {
    if (urlCryptoId && urlCryptoId !== selectedCryptoId) {
      setSelectedCryptoId(urlCryptoId);
    }
  }, [urlCryptoId, selectedCryptoId, setSelectedCryptoId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetStore();
    };
  }, [resetStore]);

  // Show setup if no crypto selected
  if (!urlCryptoId) {
    return <MonitoringSetup />;
  }

  return <MonitoringDashboard />;
}
