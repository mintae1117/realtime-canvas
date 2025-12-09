import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { RealtimeCanvas } from "./pages/RealtimeCanvas";
import { RealtimeChat } from "./pages/RealtimeChat";
import { RealtimeFacetime } from "./pages/RealtimeFacetime";
import { RealtimeMonitoring } from "./pages/RealtimeMonitoring";
import { SatelliteLocation } from "./pages/SatelliteLocation";
import { RealtimeLocation } from "./pages/RealtimeLocation";
import { RealtimeScreenShare } from "./pages/RealtimeScreenShare";

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  if (isHomePage) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/canvas" element={<RealtimeCanvas />} />
        <Route path="/canvas/:roomId" element={<RealtimeCanvas />} />
        <Route path="/chat" element={<RealtimeChat />} />
        <Route path="/chat/:roomId" element={<RealtimeChat />} />
        <Route path="/facetime" element={<RealtimeFacetime />} />
        <Route path="/facetime/:roomId" element={<RealtimeFacetime />} />
        <Route path="/monitoring" element={<RealtimeMonitoring />} />
        <Route path="/monitoring/:cryptoId" element={<RealtimeMonitoring />} />
        <Route path="/satellite" element={<SatelliteLocation />} />
        <Route path="/satellite/:satelliteId" element={<SatelliteLocation />} />
        <Route path="/location" element={<RealtimeLocation />} />
        <Route path="/location/:roomId" element={<RealtimeLocation />} />
        <Route path="/screen" element={<RealtimeScreenShare />} />
        <Route path="/screen/:roomId" element={<RealtimeScreenShare />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
