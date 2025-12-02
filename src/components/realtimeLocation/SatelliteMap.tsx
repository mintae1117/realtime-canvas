import React, { useEffect, useRef } from "react";
import { useLocationStore } from "../../store/locationStore";

// Simple SVG-based map component (no external dependencies needed)
export const SatelliteMap: React.FC = () => {
  const { selectedSatellite, positionHistory, userLocation, isConnected } =
    useLocationStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert lat/lng to canvas coordinates
  const toCanvasCoords = (
    lat: number,
    lng: number,
    width: number,
    height: number
  ) => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  // Draw the map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw world map background (simplified)
    ctx.fillStyle = "#1e3a5f";
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;

    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = ((90 - lat) / 180) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Longitude lines
    for (let lng = -180; lng <= 180; lng += 30) {
      const x = ((lng + 180) / 360) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw equator
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw simplified continents (very basic shapes)
    ctx.fillStyle = "#2d5a3d";

    // North America (simplified)
    ctx.beginPath();
    ctx.ellipse(width * 0.2, height * 0.3, 60, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // South America (simplified)
    ctx.beginPath();
    ctx.ellipse(width * 0.27, height * 0.6, 30, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Europe/Africa (simplified)
    ctx.beginPath();
    ctx.ellipse(width * 0.52, height * 0.35, 25, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width * 0.52, height * 0.55, 30, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Asia (simplified)
    ctx.beginPath();
    ctx.ellipse(width * 0.7, height * 0.35, 60, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Australia (simplified)
    ctx.beginPath();
    ctx.ellipse(width * 0.82, height * 0.65, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw position history trail
    if (positionHistory.length > 1) {
      ctx.strokeStyle = "rgba(255, 200, 0, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();

      positionHistory.forEach((pos, index) => {
        const { x, y } = toCanvasCoords(
          pos.satlatitude,
          pos.satlongitude,
          width,
          height
        );
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw trail points
      positionHistory.forEach((pos, index) => {
        const { x, y } = toCanvasCoords(
          pos.satlatitude,
          pos.satlongitude,
          width,
          height
        );
        const alpha = (index / positionHistory.length) * 0.5 + 0.2;
        ctx.fillStyle = `rgba(255, 200, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw user location
    if (userLocation) {
      const { x, y } = toCanvasCoords(
        userLocation.lat,
        userLocation.lng,
        width,
        height
      );

      // Outer glow
      ctx.fillStyle = "rgba(34, 197, 94, 0.3)";
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();

      // Inner circle
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "#22c55e";
      ctx.font = "10px sans-serif";
      ctx.fillText("You", x + 10, y + 4);
    }

    // Draw satellite position
    if (selectedSatellite) {
      const { x, y } = toCanvasCoords(
        selectedSatellite.satlatitude,
        selectedSatellite.satlongitude,
        width,
        height
      );

      // Animated pulse effect
      const pulseSize = 15 + Math.sin(Date.now() / 200) * 5;
      ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
      ctx.beginPath();
      ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
      ctx.fill();

      // Satellite icon (triangle pointing direction)
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Inner dot
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(selectedSatellite.satname, x + 12, y + 4);
    }

    // Draw connection line between user and satellite
    if (userLocation && selectedSatellite) {
      const userCoords = toCanvasCoords(
        userLocation.lat,
        userLocation.lng,
        width,
        height
      );
      const satCoords = toCanvasCoords(
        selectedSatellite.satlatitude,
        selectedSatellite.satlongitude,
        width,
        height
      );

      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(userCoords.x, userCoords.y);
      ctx.lineTo(satCoords.x, satCoords.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [selectedSatellite, positionHistory, userLocation]);

  // Animation loop for smooth updates
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        // Trigger redraw by changing a dependency
        canvas.dispatchEvent(new Event("redraw"));
      }
      animationId = requestAnimationFrame(animate);
    };

    if (isConnected) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isConnected]);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-full"
        style={{ imageRendering: "crisp-edges" }}
      />

      {/* Map Legend */}
      <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-xs text-white">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>위성</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>관측 위치</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-yellow-400"></div>
          <span>궤적</span>
        </div>
      </div>

      {/* Connection Status */}
      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
        {isConnected ? (
          <span className="text-green-400 text-xs flex items-center gap-1">
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
