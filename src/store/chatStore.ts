import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { type ChatMessage, type ChatUser } from "../types/chat";

interface ChatStore {
  // Chat state
  messages: ChatMessage[];

  // User state
  currentUser: ChatUser | null;
  users: ChatUser[];
  roomId: string | null;

  // Typing state
  typingUsers: { userId: string; userName: string }[];

  // Actions - Messages
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;

  // Actions - User
  setCurrentUser: (user: ChatUser) => void;
  addUser: (user: ChatUser) => void;
  removeUser: (userId: string) => void;
  setUsers: (users: ChatUser[]) => void;

  // Actions - Room
  setRoomId: (roomId: string | null) => void;

  // Actions - Typing
  addTypingUser: (userId: string, userName: string) => void;
  removeTypingUser: (userId: string) => void;

  // Actions - Reset
  resetStore: () => void;
}

const getRandomColor = () => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  messages: [],
  currentUser: null,
  users: [],
  roomId: null,
  typingUsers: [],

  // Message actions
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages) => set({ messages }),

  clearMessages: () => set({ messages: [] }),

  // User actions
  setCurrentUser: (user) => set({ currentUser: user }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users.filter((u) => u.id !== user.id), user],
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),

  setUsers: (users) => set({ users }),

  // Room actions
  setRoomId: (roomId) => set({ roomId }),

  // Typing actions
  addTypingUser: (userId, userName) =>
    set((state) => ({
      typingUsers: [
        ...state.typingUsers.filter((u) => u.userId !== userId),
        { userId, userName },
      ],
    })),

  removeTypingUser: (userId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u.userId !== userId),
    })),

  // Reset
  resetStore: () =>
    set({
      messages: [],
      currentUser: null,
      users: [],
      roomId: null,
      typingUsers: [],
    }),
}));

export const createChatUser = (name: string): ChatUser => ({
  id: uuidv4(),
  name,
  color: getRandomColor(),
  isOnline: true,
});
