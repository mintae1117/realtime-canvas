/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useChatStore } from "../store/chatStore";
import { type RealtimeChatEvent, type ChatMessage } from "../types/chat";

export const useRealtimeChat = (roomId: string | null) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const {
    currentUser,
    addMessage,
    addUser,
    removeUser,
    addTypingUser,
    removeTypingUser,
  } = useChatStore();

  // Broadcast event to other users
  const broadcastEvent = useCallback(
    (event: RealtimeChatEvent) => {
      if (!channelRef.current || !roomId) return;

      channelRef.current.send({
        type: "broadcast",
        event: "chat-event",
        payload: event,
      });
    },
    [roomId]
  );

  // Handle incoming chat events
  const handleChatEvent = useCallback(
    (event: RealtimeChatEvent) => {
      switch (event.type) {
        case "message-send":
          if (event.data.userId !== currentUser?.id) {
            addMessage(event.data);
          }
          break;

        case "user-typing":
          if (event.data.userId !== currentUser?.id) {
            addTypingUser(event.data.userId, event.data.userName);
          }
          break;

        case "user-stop-typing":
          removeTypingUser(event.data.userId);
          break;
      }
    },
    [currentUser, addMessage, addTypingUser, removeTypingUser]
  );

  // Initialize realtime connection
  useEffect(() => {
    if (!roomId || !currentUser) return;

    // Create channel
    const channel = supabase.channel(`chat:${roomId}`, {
      config: {
        broadcast: { self: false },
        presence: { key: currentUser.id },
      },
    });

    // Subscribe to chat events
    channel
      .on("broadcast", { event: "chat-event" }, ({ payload }) => {
        handleChatEvent(payload as RealtimeChatEvent);
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

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
      setIsConnected(false);
    };
  }, [roomId, currentUser, handleChatEvent, addUser, removeUser]);

  // Send message
  const sendMessage = useCallback(
    (message: ChatMessage) => {
      broadcastEvent({ type: "message-send", data: message });
    },
    [broadcastEvent]
  );

  // Send typing status
  const sendTyping = useCallback(() => {
    if (currentUser) {
      broadcastEvent({
        type: "user-typing",
        data: { userId: currentUser.id, userName: currentUser.name },
      });
    }
  }, [currentUser, broadcastEvent]);

  // Send stop typing status
  const sendStopTyping = useCallback(() => {
    if (currentUser) {
      broadcastEvent({
        type: "user-stop-typing",
        data: { userId: currentUser.id },
      });
    }
  }, [currentUser, broadcastEvent]);

  return {
    sendMessage,
    sendTyping,
    sendStopTyping,
    isConnected,
  };
};
