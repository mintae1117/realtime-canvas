import React, { useState } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useChatStore } from "../../store/chatStore";
import { useRealtimeChat } from "../../hooks/useRealtimeChat";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

export const ChatRoom: React.FC = () => {
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const { roomId, currentUser, users } = useChatStore();
  const { sendMessage, sendTyping, sendStopTyping, isConnected } =
    useRealtimeChat(roomId);

  const totalUsers = users.length + (currentUser ? 1 : 0);

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-4 pb-20 md:pb-4 md:pl-20">
      {/* Chat Container - 카카오톡 스타일 */}
      <div className="w-full max-w-lg h-full max-h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <header className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-base font-bold text-white">채팅방</h1>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-100 font-mono">
                    #{roomId}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-300" : "bg-red-400"
                  }`}
                />
                <span className="text-xs text-green-100">
                  {isConnected ? "연결됨" : "연결 안됨"}
                </span>
              </div>
              {/* User count */}
              <button
                onClick={() => setIsUserListOpen(!isUserListOpen)}
                className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-white text-xs hover:bg-white/30 transition-colors"
              >
                <span>{totalUsers}명</span>
                {isUserListOpen ? (
                  <IoChevronUp className="text-sm" />
                ) : (
                  <IoChevronDown className="text-sm" />
                )}
              </button>
            </div>
          </div>

          {/* User List Dropdown */}
          {isUserListOpen && (
            <div className="mt-3 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <div className="flex flex-wrap gap-2">
                {currentUser && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 rounded-full">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentUser.color }}
                    />
                    <span className="text-xs text-white font-medium">
                      {currentUser.name} (나)
                    </span>
                  </div>
                )}
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-full"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-xs text-white/90">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden bg-[#B2C7D9]">
          <MessageList />
        </div>

        {/* Input Area */}
        <MessageInput
          onSendMessage={sendMessage}
          onTyping={sendTyping}
          onStopTyping={sendStopTyping}
        />
      </div>
    </div>
  );
};
