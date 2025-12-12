/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  useScreenShareStore,
  type ScreenShareUser,
} from "../store/screenShareStore";

// WebRTC configuration
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

// Signaling event types
type SignalingEvent =
  | {
      type: "offer";
      data: { from: string; to?: string; offer: RTCSessionDescriptionInit };
    }
  | {
      type: "answer";
      data: { from: string; answer: RTCSessionDescriptionInit };
    }
  | {
      type: "ice-candidate";
      data: { from: string; candidate: RTCIceCandidateInit };
    }
  | { type: "user-joined"; data: { user: ScreenShareUser } }
  | { type: "user-left"; data: { userId: string } }
  | { type: "share-started"; data: { userId: string } }
  | { type: "share-stopped"; data: { userId: string } }
  | { type: "request-stream"; data: { from: string; to: string } };

export const useRealtimeScreenShare = (roomId: string | null) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  const {
    currentUser,
    localStream,
    setLocalStream,
    addRemoteStream,
    removeRemoteStream,
    addUser,
    removeUser,
    updateUserSharing,
    setIsConnected: setStoreConnected,
    isSharing,
    setIsSharing,
  } = useScreenShareStore();

  // Create peer connection for a specific user
  const createPeerConnection = useCallback(
    (targetUserId: string): RTCPeerConnection => {
      const existingConnection = peerConnectionsRef.current.get(targetUserId);
      if (existingConnection) {
        existingConnection.close();
      }

      const peerConnection = new RTCPeerConnection(ICE_SERVERS);

      // Add local tracks to connection if sharing
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && channelRef.current) {
          channelRef.current.send({
            type: "broadcast",
            event: "signaling",
            payload: {
              type: "ice-candidate",
              data: {
                from: currentUser?.id,
                candidate: event.candidate.toJSON(),
              },
            } as SignalingEvent,
          });
        }
      };

      // Handle incoming tracks
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteStream) {
          addRemoteStream(targetUserId, remoteStream);
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        if (
          peerConnection.connectionState === "disconnected" ||
          peerConnection.connectionState === "failed"
        ) {
          removeRemoteStream(targetUserId);
          peerConnectionsRef.current.delete(targetUserId);
        }
      };

      peerConnectionsRef.current.set(targetUserId, peerConnection);
      return peerConnection;
    },
    [localStream, currentUser, addRemoteStream, removeRemoteStream]
  );

  // Send offer to a specific user
  const sendOffer = useCallback(
    async (targetUserId: string) => {
      const peerConnection = createPeerConnection(targetUserId);

      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        if (channelRef.current) {
          channelRef.current.send({
            type: "broadcast",
            event: "signaling",
            payload: {
              type: "offer",
              data: {
                from: currentUser?.id,
                offer: offer,
              },
            } as SignalingEvent,
          });
        }
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    },
    [createPeerConnection, currentUser]
  );

  // Handle incoming signaling events
  const handleSignalingEvent = useCallback(
    async (event: SignalingEvent) => {
      switch (event.type) {
        case "offer": {
          if (event.data.from === currentUser?.id) return;

          const peerConnection = createPeerConnection(event.data.from);

          try {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(event.data.offer)
            );
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            if (channelRef.current) {
              channelRef.current.send({
                type: "broadcast",
                event: "signaling",
                payload: {
                  type: "answer",
                  data: {
                    from: currentUser?.id,
                    answer: answer,
                  },
                } as SignalingEvent,
              });
            }
          } catch (error) {
            console.error("Error handling offer:", error);
          }
          break;
        }

        case "answer": {
          if (event.data.from === currentUser?.id) return;

          const peerConnection = peerConnectionsRef.current.get(
            event.data.from
          );
          if (peerConnection) {
            try {
              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(event.data.answer)
              );
            } catch (error) {
              console.error("Error handling answer:", error);
            }
          }
          break;
        }

        case "ice-candidate": {
          if (event.data.from === currentUser?.id) return;

          const peerConnection = peerConnectionsRef.current.get(
            event.data.from
          );
          if (peerConnection) {
            try {
              await peerConnection.addIceCandidate(
                new RTCIceCandidate(event.data.candidate)
              );
            } catch (error) {
              console.error("Error adding ICE candidate:", error);
            }
          }
          break;
        }

        case "user-joined": {
          if (event.data.user.id !== currentUser?.id) {
            addUser(event.data.user);
            // If we're sharing, send offer to the new user
            if (isSharing && localStream) {
              await sendOffer(event.data.user.id);
            }
          }
          break;
        }

        case "user-left": {
          removeUser(event.data.userId);
          const peerConnection = peerConnectionsRef.current.get(
            event.data.userId
          );
          if (peerConnection) {
            peerConnection.close();
            peerConnectionsRef.current.delete(event.data.userId);
          }
          removeRemoteStream(event.data.userId);
          break;
        }

        case "share-started": {
          updateUserSharing(event.data.userId, true);
          // Request stream from the user who started sharing
          // The sharer will receive this and send us an offer
          if (channelRef.current && currentUser) {
            channelRef.current.send({
              type: "broadcast",
              event: "signaling",
              payload: {
                type: "request-stream",
                data: {
                  from: currentUser.id,
                  to: event.data.userId,
                },
              } as SignalingEvent,
            });
          }
          break;
        }

        case "share-stopped": {
          updateUserSharing(event.data.userId, false);
          removeRemoteStream(event.data.userId);
          break;
        }

        case "request-stream": {
          // Someone is requesting our stream
          if (event.data.to === currentUser?.id && isSharing && localStream) {
            // Send offer to the requester
            await sendOffer(event.data.from);
          }
          break;
        }
      }
    },
    [
      currentUser,
      createPeerConnection,
      addUser,
      removeUser,
      removeRemoteStream,
      sendOffer,
      isSharing,
      localStream,
      updateUserSharing,
    ]
  );

  // Stop screen sharing
  const stopScreenShare = useCallback(() => {
    const stream = useScreenShareStore.getState().localStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setIsSharing(false);

    // Update current user sharing status
    const user = useScreenShareStore.getState().currentUser;
    if (user) {
      useScreenShareStore.getState().setCurrentUser({
        ...user,
        isSharing: false,
      });
    }

    // Notify others that we stopped sharing
    if (channelRef.current && user) {
      // Update presence with isSharing status
      channelRef.current.track({
        user: user,
        isSharing: false,
        online_at: new Date().toISOString(),
      });

      channelRef.current.send({
        type: "broadcast",
        event: "signaling",
        payload: {
          type: "share-stopped",
          data: { userId: user.id },
        } as SignalingEvent,
      });
    }

    // Close all peer connections
    peerConnectionsRef.current.forEach((connection) => {
      connection.close();
    });
    peerConnectionsRef.current.clear();
  }, [setLocalStream, setIsSharing]);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Handle when user stops sharing via browser UI
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      setLocalStream(stream);
      setIsSharing(true);

      // Update current user sharing status
      if (currentUser) {
        useScreenShareStore.getState().setCurrentUser({
          ...currentUser,
          isSharing: true,
        });
      }

      // Notify others that we started sharing
      if (channelRef.current && currentUser) {
        // Update presence with isSharing status
        await channelRef.current.track({
          user: currentUser,
          isSharing: true,
          online_at: new Date().toISOString(),
        });

        channelRef.current.send({
          type: "broadcast",
          event: "signaling",
          payload: {
            type: "share-started",
            data: { userId: currentUser.id },
          } as SignalingEvent,
        });

        // Send offers to all connected users
        const users = useScreenShareStore.getState().users;
        for (const user of users) {
          await sendOffer(user.id);
        }
      }

      return stream;
    } catch (error) {
      console.error("Error starting screen share:", error);
      return null;
    }
  }, [setLocalStream, setIsSharing, currentUser, sendOffer, stopScreenShare]);

  // Leave room
  const leaveRoom = useCallback(() => {
    // Notify others that we're leaving
    if (channelRef.current && currentUser) {
      channelRef.current.send({
        type: "broadcast",
        event: "signaling",
        payload: {
          type: "user-left",
          data: { userId: currentUser.id },
        } as SignalingEvent,
      });
    }

    // Stop screen sharing if active
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    // Close all peer connections
    peerConnectionsRef.current.forEach((connection) => {
      connection.close();
    });
    peerConnectionsRef.current.clear();

    // Unsubscribe from channel
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    setIsConnected(false);
    setStoreConnected(false);
  }, [currentUser, localStream, setStoreConnected]);

  // Initialize realtime connection
  useEffect(() => {
    if (!roomId || !currentUser) return;

    const channel = supabase.channel(`screenshare:${roomId}`, {
      config: {
        broadcast: { self: false },
        presence: { key: currentUser.id },
      },
    });

    // Subscribe to signaling events
    channel
      .on("broadcast", { event: "signaling" }, ({ payload }) => {
        handleSignalingEvent(payload as SignalingEvent);
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.user && presence.user.id !== currentUser.id) {
              addUser(presence.user);
              // If this user has isSharing in their presence data, update their sharing status
              if (presence.isSharing) {
                updateUserSharing(presence.user.id, true);
                // Request their stream
                channel.send({
                  type: "broadcast",
                  event: "signaling",
                  payload: {
                    type: "request-stream",
                    data: {
                      from: currentUser.id,
                      to: presence.user.id,
                    },
                  } as SignalingEvent,
                });
              }
            }
          });
        });
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        newPresences.forEach((presence: any) => {
          if (presence.user && presence.user.id !== currentUser.id) {
            addUser(presence.user);
            // Broadcast that we joined
            channel.send({
              type: "broadcast",
              event: "signaling",
              payload: {
                type: "user-joined",
                data: { user: currentUser },
              } as SignalingEvent,
            });
          }
        });
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        leftPresences.forEach((presence: any) => {
          if (presence.user) {
            removeUser(presence.user.id);
            const peerConnection = peerConnectionsRef.current.get(
              presence.user.id
            );
            if (peerConnection) {
              peerConnection.close();
              peerConnectionsRef.current.delete(presence.user.id);
            }
            removeRemoteStream(presence.user.id);
          }
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const currentIsSharing = useScreenShareStore.getState().isSharing;
          await channel.track({
            user: currentUser,
            isSharing: currentIsSharing,
            online_at: new Date().toISOString(),
          });
          setIsConnected(true);
          setStoreConnected(true);

          // Broadcast that we joined
          channel.send({
            type: "broadcast",
            event: "signaling",
            payload: {
              type: "user-joined",
              data: { user: currentUser },
            } as SignalingEvent,
          });
        } else {
          setIsConnected(false);
          setStoreConnected(false);
        }
      });

    channelRef.current = channel;

    return () => {
      leaveRoom();
    };
  }, [
    roomId,
    currentUser,
    handleSignalingEvent,
    addUser,
    removeUser,
    removeRemoteStream,
    setStoreConnected,
    leaveRoom,
  ]);

  return {
    isConnected,
    startScreenShare,
    stopScreenShare,
    leaveRoom,
  };
};
