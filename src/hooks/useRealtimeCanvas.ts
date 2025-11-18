/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useCanvasStore } from "../store/canvasStore";
import {
  type RealtimeDrawingEvent,
  type DrawingLine,
  type CanvasImage,
  type TextAnnotation,
} from "../types/canvas";

export const useRealtimeCanvas = (roomId: string | null) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const {
    currentUser,
    addLine,
    removeLine,
    addImage,
    updateImage,
    removeImage,
    addText,
    updateText,
    removeText,
    clearCanvas,
    addUser,
    removeUser,
  } = useCanvasStore();

  // Send drawing event to other users
  const broadcastEvent = useCallback(
    (event: RealtimeDrawingEvent) => {
      if (!channelRef.current || !roomId) return;

      channelRef.current.send({
        type: "broadcast",
        event: "canvas-event",
        payload: event,
      });
    },
    [roomId]
  );

  // Handle incoming drawing events
  const handleDrawingEvent = useCallback(
    (event: RealtimeDrawingEvent) => {
      switch (event.type) {
        case "line-add":
          // Don't add our own lines again
          if (event.data.userId !== currentUser?.id) {
            addLine(event.data);
          }
          break;

        case "line-remove":
          removeLine(event.data.id);
          break;

        case "image-add":
          if (event.data.userId !== currentUser?.id) {
            addImage(event.data);
          }
          break;

        case "image-update":
          updateImage(event.data.id, event.data);
          break;

        case "image-remove":
          removeImage(event.data.id);
          break;

        case "text-add":
          if (event.data.userId !== currentUser?.id) {
            addText(event.data);
          }
          break;

        case "text-update":
          updateText(event.data.id, event.data);
          break;

        case "text-remove":
          removeText(event.data.id);
          break;

        case "clear-canvas":
          if (event.data.userId !== currentUser?.id) {
            clearCanvas();
          }
          break;
      }
    },
    [
      currentUser,
      addLine,
      removeLine,
      addImage,
      updateImage,
      removeImage,
      addText,
      updateText,
      removeText,
      clearCanvas,
    ]
  );

  // Initialize realtime connection
  useEffect(() => {
    if (!roomId || !currentUser) return;

    // Create channel
    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        broadcast: { self: false },
        presence: { key: currentUser.id },
      },
    });

    // Subscribe to canvas events
    channel
      .on("broadcast", { event: "canvas-event" }, ({ payload }) => {
        handleDrawingEvent(payload as RealtimeDrawingEvent);
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.user && presence.user.id !== currentUser.id) {
              addUser(presence.user);
            }
          });
        });
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        newPresences.forEach((presence: any) => {
          if (presence.user && presence.user.id !== currentUser.id) {
            addUser(presence.user);
          }
        });
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        leftPresences.forEach((presence: any) => {
          if (presence.user) {
            removeUser(presence.user.id);
          }
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track presence
          await channel.track({
            user: currentUser,
            online_at: new Date().toISOString(),
          });
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      });

    channelRef.current = channel;

    // Cleanup
    return () => {
      channel.unsubscribe();
      channelRef.current = null;
      setIsConnected(false);
    };
  }, [roomId, currentUser, handleDrawingEvent, addUser, removeUser]);

  // Methods to broadcast events
  const sendLine = useCallback(
    (line: DrawingLine) => {
      broadcastEvent({ type: "line-add", data: line });
    },
    [broadcastEvent]
  );

  const sendImage = useCallback(
    (image: CanvasImage) => {
      broadcastEvent({ type: "image-add", data: image });
    },
    [broadcastEvent]
  );

  const sendImageUpdate = useCallback(
    (image: CanvasImage) => {
      broadcastEvent({ type: "image-update", data: image });
    },
    [broadcastEvent]
  );

  const sendText = useCallback(
    (text: TextAnnotation) => {
      broadcastEvent({ type: "text-add", data: text });
    },
    [broadcastEvent]
  );

  const sendClearCanvas = useCallback(() => {
    if (currentUser) {
      broadcastEvent({
        type: "clear-canvas",
        data: { userId: currentUser.id },
      });
    }
  }, [currentUser, broadcastEvent]);

  return {
    sendLine,
    sendImage,
    sendImageUpdate,
    sendText,
    sendClearCanvas,
    isConnected,
  };
};
