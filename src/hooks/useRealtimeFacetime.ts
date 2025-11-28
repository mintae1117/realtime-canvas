/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useFacetimeStore, type FacetimeUser } from "../store/facetimeStore";

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
  | { type: "offer"; data: { from: string; offer: RTCSessionDescriptionInit } }
  | {
      type: "answer";
      data: { from: string; answer: RTCSessionDescriptionInit };
    }
  | {
      type: "ice-candidate";
      data: { from: string; candidate: RTCIceCandidateInit };
    }
  | { type: "user-joined"; data: { user: FacetimeUser } }
  | { type: "user-left"; data: { userId: string } };

export const useRealtimeFacetime = (roomId: string | null) => {
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
    setIsConnected: setStoreConnected,
    isVideoEnabled,
    isAudioEnabled,
  } = useFacetimeStore();

  // Create peer connection for a specific user
  const createPeerConnection = useCallback(
    (targetUserId: string): RTCPeerConnection => {
      const existingConnection = peerConnectionsRef.current.get(targetUserId);
      if (existingConnection) {
        existingConnection.close();
      }

      const peerConnection = new RTCPeerConnection(ICE_SERVERS);

      // Add local tracks to connection
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
            // Send offer to the new user
            await sendOffer(event.data.user.id);
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
      }
    },
    [
      currentUser,
      createPeerConnection,
      addUser,
      removeUser,
      removeRemoteStream,
      sendOffer,
    ]
  );

  // Get user media
  const getUserMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Error getting user media:", error);
      // Try with only audio if video fails
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        setLocalStream(audioStream);
        return audioStream;
      } catch (audioError) {
        console.error("Error getting audio:", audioError);
        return null;
      }
    }
  }, [setLocalStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      useFacetimeStore.getState().setVideoEnabled(!isVideoEnabled);
    }
  }, [localStream, isVideoEnabled]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      useFacetimeStore.getState().setAudioEnabled(!isAudioEnabled);
    }
  }, [localStream, isAudioEnabled]);

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

    // Close all peer connections
    peerConnectionsRef.current.forEach((connection) => {
      connection.close();
    });
    peerConnectionsRef.current.clear();

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

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
    if (!roomId || !currentUser || !localStream) return;

    const channel = supabase.channel(`facetime:${roomId}`, {
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
          await channel.track({
            user: currentUser,
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
    localStream,
    handleSignalingEvent,
    addUser,
    removeUser,
    removeRemoteStream,
    setStoreConnected,
    leaveRoom,
  ]);

  return {
    isConnected,
    getUserMedia,
    toggleVideo,
    toggleAudio,
    leaveRoom,
  };
};
