/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useRealtimeLocationStore } from "../../store/realtimeLocationStore";

declare global {
  interface Window {
    kakao: any;
  }
}

export const LocationMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const overlaysRef = useRef<Map<string, any>>(new Map());
  const initializedRef = useRef(false);
  const scriptLoadedRef = useRef(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { currentUser, users } = useRealtimeLocationStore();

  // Initialize Kakao Map
  useEffect(() => {
    // Prevent double initialization
    if (initializedRef.current) return;

    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          if (mapRef.current && !mapInstanceRef.current) {
            const options = {
              center: new window.kakao.maps.LatLng(37.5665, 126.978),
              level: 5,
            };
            mapInstanceRef.current = new window.kakao.maps.Map(
              mapRef.current,
              options
            );
            initializedRef.current = true;
            setIsMapLoaded(true);
          }
        });
      }
    };

    // Check if Kakao Maps is already loaded
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    } else if (!scriptLoadedRef.current) {
      // Load Kakao Maps script dynamically
      scriptLoadedRef.current = true;
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_KEY
      }&autoload=false`;
      script.async = true;
      script.onload = loadKakaoMap;
      document.head.appendChild(script);
    }

    // No cleanup - keep map instance alive
  }, []);

  // Update markers when users change
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !window.kakao?.maps) return;

    try {
      const map = mapInstanceRef.current;
      const allUsers = currentUser ? [currentUser, ...users] : users;
      const currentUserIds = new Set(allUsers.map((u) => u.id));

      // Remove markers for users who left
      markersRef.current.forEach((marker, oduderId) => {
        if (oduderId === "initialized") return; // Skip the initialized flag
        if (!currentUserIds.has(oduderId)) {
          try {
            marker.setMap(null);
          } catch (e) {
            console.log(e);
            // Ignore cleanup errors
          }
          markersRef.current.delete(oduderId);
          const overlay = overlaysRef.current.get(oduderId);
          if (overlay) {
            try {
              overlay.setMap(null);
            } catch (e) {
              console.log(e);
              // Ignore cleanup errors
            }
            overlaysRef.current.delete(oduderId);
          }
        }
      });

      // Update or create markers for current users
      allUsers.forEach((user) => {
        if (user.latitude === null || user.longitude === null) return;

        const position = new window.kakao.maps.LatLng(
          user.latitude,
          user.longitude
        );

        const marker = markersRef.current.get(user.id);
        const overlay = overlaysRef.current.get(user.id);

        if (marker && marker !== true) {
          // Update existing marker position
          try {
            marker.setPosition(position);
            if (overlay) {
              overlay.setPosition(position);
            }
          } catch (e) {
            console.log(e);
            // If update fails, recreate marker
            markersRef.current.delete(user.id);
            overlaysRef.current.delete(user.id);
          }
        }

        if (!markersRef.current.has(user.id)) {
          // Create new marker with custom styling
          const markerContent = document.createElement("div");
          markerContent.innerHTML = `
            <div style="
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
            ">
              <div style="
                width: 40px;
                height: 40px;
                background-color: ${user.color};
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                color: white;
              ">
                ${user.name.charAt(0).toUpperCase()}
              </div>
              <div style="
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 10px solid ${user.color};
                margin-top: -2px;
              "></div>
            </div>
          `;

          const customOverlay = new window.kakao.maps.CustomOverlay({
            position: position,
            content: markerContent,
            yAnchor: 1,
          });
          customOverlay.setMap(map);
          markersRef.current.set(user.id, customOverlay);

          // Create name overlay
          const nameContent = document.createElement("div");
          nameContent.innerHTML = `
            <div style="
              background-color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              color: #374151;
              box-shadow: 0 2px 4px rgba(0,0,0,0.15);
              white-space: nowrap;
              margin-top: 4px;
            ">
              ${user.name}${user.id === currentUser?.id ? " (나)" : ""}
            </div>
          `;

          const nameOverlay = new window.kakao.maps.CustomOverlay({
            position: position,
            content: nameContent,
            yAnchor: 2.5,
          });
          nameOverlay.setMap(map);
          overlaysRef.current.set(user.id, nameOverlay);
        }
      });

      // Center map on current user if available
      if (currentUser?.latitude && currentUser?.longitude) {
        const currentPosition = new window.kakao.maps.LatLng(
          currentUser.latitude,
          currentUser.longitude
        );

        // Only pan if it's the first location update
        if (!markersRef.current.has("initialized")) {
          map.panTo(currentPosition);
          markersRef.current.set("initialized", true);
        }
      }
    } catch (error) {
      console.error("Error updating markers:", error);
    }
  }, [isMapLoaded, currentUser, users]);

  // Center map on specific user
  const centerOnUser = (userId: string) => {
    if (!mapInstanceRef.current) return;

    const user =
      userId === currentUser?.id
        ? currentUser
        : users.find((u) => u.id === userId);

    if (user?.latitude && user?.longitude) {
      const position = new window.kakao.maps.LatLng(
        user.latitude,
        user.longitude
      );
      mapInstanceRef.current.panTo(position);
    }
  };

  // Fit bounds to show all users
  const fitBoundsToAllUsers = () => {
    if (!mapInstanceRef.current) return;

    const allUsers = currentUser ? [currentUser, ...users] : users;
    const validUsers = allUsers.filter(
      (u) => u.latitude !== null && u.longitude !== null
    );

    if (validUsers.length === 0) return;

    if (validUsers.length === 1) {
      centerOnUser(validUsers[0].id);
      return;
    }

    const bounds = new window.kakao.maps.LatLngBounds();
    validUsers.forEach((user) => {
      bounds.extend(
        new window.kakao.maps.LatLng(user.latitude!, user.longitude!)
      );
    });
    mapInstanceRef.current.setBounds(bounds);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={() => currentUser && centerOnUser(currentUser.id)}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="내 위치로 이동"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
            />
          </svg>
        </button>
        <button
          onClick={fitBoundsToAllUsers}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="모든 사용자 보기"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      </div>

      {/* Loading overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">지도를 불러오는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};
