export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userColor: string;
  timestamp: number;
}

export interface ChatUser {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
}

export type RealtimeChatEvent =
  | { type: "message-send"; data: ChatMessage }
  | { type: "user-typing"; data: { userId: string; userName: string } }
  | { type: "user-stop-typing"; data: { userId: string } };
