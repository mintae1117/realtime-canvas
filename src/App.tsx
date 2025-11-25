import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { RealtimeCanvas } from "./pages/RealtimeCanvas";
import { RealtimeChat } from "./pages/RealtimeChat";
import { RealtimeFacetime } from "./pages/RealtimeFacetime";
import { RealtimeMonitoring } from "./pages/RealtimeMonitoring";
import { RealtimeLocation } from "./pages/RealtimeLocation";

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
        <Route path="/facetime" element={<RealtimeFacetime />} />
        <Route path="/monitoring" element={<RealtimeMonitoring />} />
        <Route path="/location" element={<RealtimeLocation />} />
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
