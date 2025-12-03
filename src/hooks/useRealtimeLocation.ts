/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  useRealtimeLocationStore,
  type LocationUser,
} from "../store/realtimeLocationStore";

// Event types for location sharing
type LocationEvent =
  | {
      type: "location-update";
      data: {
        userId: string;
        latitude: number;
        longitude: number;
        accuracy: number | null;
        heading: number | null;
        speed: number | null;
        lastUpdated: number;
      };
    }
  | { type: "user-joined"; data: { user: LocationUser } }
  | { type: "user-left"; data: { userId: string } };

export const useRealtimeLocation = (roomId: string | null) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { currentUser, setIsConnected: setStoreConnected } =
    useRealtimeLocationStore();

  // Stop watching location
  const stopWatchingLocation = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    useRealtimeLocationStore.getState().setIsWatching(false);
  }, []);

  // Start watching location
  const startWatchingLocation = useCallback(() => {
    if (!navigator.geolocation) {
      useRealtimeLocationStore
        .getState()
        .setLocationError("Geolocation is not supported by your browser");
      return;
    }

    const store = useRealtimeLocationStore.getState();
    const user = store.currentUser;
    if (!user) return;

    store.setLocationError(null);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
        };

        useRealtimeLocationStore.getState().updateCurrentUserLocation(location);

        // Broadcast location
        if (channelRef.current) {
          channelRef.current.send({
            type: "broadcast",
            event: "location-event",
            payload: {
              type: "location-update",
              data: {
                userId: user.id,
                ...location,
                lastUpdated: Date.now(),
              },
            } as LocationEvent,
          });
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            useRealtimeLocationStore
              .getState()
              .setLocationError(
                "위치 권한이 거부되었습니다. 설정에서 허용해주세요."
              );
            break;
          case error.POSITION_UNAVAILABLE:
            useRealtimeLocationStore
              .getState()
              .setLocationError("위치 정보를 사용할 수 없습니다.");
            break;
          case error.TIMEOUT:
            useRealtimeLocationStore
              .getState()
              .setLocationError("위치 요청 시간이 초과되었습니다.");
            break;
          default:
            useRealtimeLocationStore
              .getState()
              .setLocationError("알 수 없는 오류가 발생했습니다.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );

    watchIdRef.current = id;
    useRealtimeLocationStore.getState().setIsWatching(true);
  }, []);

  // Leave room
  const leaveRoom = useCallback(() => {
    const user = useRealtimeLocationStore.getState().currentUser;

    // Notify others that we're leaving
    if (channelRef.current && user) {
      channelRef.current.send({
        type: "broadcast",
        event: "location-event",
        payload: {
          type: "user-left",
          data: { userId: user.id },
        } as LocationEvent,
      });
    }

    // Stop watching location
    stopWatchingLocation();

    // Unsubscribe from channel
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    setIsConnected(false);
    setStoreConnected(false);
  }, [stopWatchingLocation, setStoreConnected]);

  // Initialize realtime connection
  useEffect(() => {
    if (!roomId || !currentUser) return;

    // Prevent multiple subscriptions
    if (channelRef.current) return;

    const channel = supabase.channel(`location:${roomId}`, {
      config: {
        broadcast: { self: false },
        presence: { key: currentUser.id },
      },
    });

    // Subscribe to location events
    channel
      .on("broadcast", { event: "location-event" }, ({ payload }) => {
        const event = payload as LocationEvent;
        switch (event.type) {
          case "location-update": {
            if (event.data.userId !== currentUser.id) {
              useRealtimeLocationStore
                .getState()
                .updateUserLocation(event.data.userId, {
                  latitude: event.data.latitude,
                  longitude: event.data.longitude,
                  accuracy: event.data.accuracy,
                  heading: event.data.heading,
                  speed: event.data.speed,
                  lastUpdated: event.data.lastUpdated,
                });
            }
            break;
          }
          case "user-joined": {
            if (event.data.user.id !== currentUser.id) {
              useRealtimeLocationStore.getState().addUser(event.data.user);
            }
            break;
          }
          case "user-left": {
            useRealtimeLocationStore.getState().removeUser(event.data.userId);
            break;
          }
        }
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.user && presence.user.id !== currentUser.id) {
              useRealtimeLocationStore.getState().addUser(presence.user);
            }
          });
        });
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        newPresences.forEach((presence: any) => {
          if (presence.user && presence.user.id !== currentUser.id) {
            useRealtimeLocationStore.getState().addUser(presence.user);
            // Broadcast that we joined with our current location
            channel.send({
              type: "broadcast",
              event: "location-event",
              payload: {
                type: "user-joined",
                data: { user: currentUser },
              } as LocationEvent,
            });
          }
        });
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        leftPresences.forEach((presence: any) => {
          if (presence.user) {
            useRealtimeLocationStore.getState().removeUser(presence.user.id);
          }
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user: currentUser,
            online_at: new Date().toISOString(),
          });
          setIsConnected(true);
          setStoreConnected(true);

          // Broadcast that we joined
          channel.send({
            type: "broadcast",
            event: "location-event",
            payload: {
              type: "user-joined",
              data: { user: currentUser },
            } as LocationEvent,
          });

          // Start watching location after connected
          if (!navigator.geolocation) {
            useRealtimeLocationStore
              .getState()
              .setLocationError("Geolocation is not supported by your browser");
            return;
          }

          useRealtimeLocationStore.getState().setLocationError(null);

          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
              };

              useRealtimeLocationStore
                .getState()
                .updateCurrentUserLocation(location);

              // Broadcast location
              if (channelRef.current) {
                channelRef.current.send({
                  type: "broadcast",
                  event: "location-event",
                  payload: {
                    type: "location-update",
                    data: {
                      userId: currentUser.id,
                      ...location,
                      lastUpdated: Date.now(),
                    },
                  } as LocationEvent,
                });
              }
            },
            (error) => {
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  useRealtimeLocationStore
                    .getState()
                    .setLocationError(
                      "위치 권한이 거부되었습니다. 설정에서 허용해주세요."
                    );
                  break;
                case error.POSITION_UNAVAILABLE:
                  useRealtimeLocationStore
                    .getState()
                    .setLocationError("위치 정보를 사용할 수 없습니다.");
                  break;
                case error.TIMEOUT:
                  useRealtimeLocationStore
                    .getState()
                    .setLocationError("위치 요청 시간이 초과되었습니다.");
                  break;
                default:
                  useRealtimeLocationStore
                    .getState()
                    .setLocationError("알 수 없는 오류가 발생했습니다.");
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 1000,
            }
          );

          watchIdRef.current = watchId;
          useRealtimeLocationStore.getState().setIsWatching(true);
        } else {
          setIsConnected(false);
          setStoreConnected(false);
        }
      });

    channelRef.current = channel;

    return () => {
      // Stop watching location
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      useRealtimeLocationStore.getState().setIsWatching(false);

      // Notify others that we're leaving
      if (channelRef.current && currentUser) {
        channelRef.current.send({
          type: "broadcast",
          event: "location-event",
          payload: {
            type: "user-left",
            data: { userId: currentUser.id },
          } as LocationEvent,
        });
      }

      // Unsubscribe from channel
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }

      setIsConnected(false);
      setStoreConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, currentUser?.id]); // Only depend on roomId and currentUser.id

  return {
    isConnected,
    startWatchingLocation,
    stopWatchingLocation,
    leaveRoom,
  };
};
