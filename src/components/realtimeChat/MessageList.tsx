import React, { useEffect, useRef } from "react";
import { useChatStore } from "../../store/chatStore";

export const MessageList: React.FC = () => {
  const { messages, currentUser, typingUsers } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div
            className="text-center px-4 py-3 rounded-xl text-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.5)",
              color: "#6b7280",
            }}
          >
            메시지가 없습니다. 첫 번째 메시지를 보내보세요!
          </div>
        </div>
      )}

      {messages.map((message) => {
        const isMyMessage = message.userId === currentUser?.id;

        return (
          <div
            key={message.id}
            className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
          >
            {/* Other user's message */}
            {!isMyMessage && (
              <div className="flex items-start gap-2 max-w-[80%]">
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: message.userColor,
                    color: "#ffffff",
                  }}
                >
                  {message.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  {/* Name */}
                  <span
                    className="text-xs ml-1 mb-1 block"
                    style={{ color: "#4b5563" }}
                  >
                    {message.userName}
                  </span>
                  {/* Message bubble */}
                  <div className="flex items-end gap-1">
                    <div
                      className="px-3 py-2 rounded-2xl rounded-tl-md shadow-sm"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <p
                        className="text-sm whitespace-pre-wrap break-all"
                        style={{ color: "#1f2937" }}
                      >
                        {message.text}
                      </p>
                    </div>
                    <span
                      className="text-[10px] flex-shrink-0"
                      style={{ color: "#6b7280" }}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* My message */}
            {isMyMessage && (
              <div className="flex items-end gap-1 max-w-[80%]">
                <span
                  className="text-[10px] flex-shrink-0"
                  style={{ color: "#6b7280" }}
                >
                  {formatTime(message.timestamp)}
                </span>
                <div
                  className="px-3 py-2 rounded-2xl rounded-tr-md shadow-sm"
                  style={{ backgroundColor: "#FEE500" }}
                >
                  <p
                    className="text-sm whitespace-pre-wrap break-all"
                    style={{ color: "#1f2937" }}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="flex items-start gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#d1d5db" }}
          >
            <div className="flex space-x-1">
              <div
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ backgroundColor: "#6b7280" }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ backgroundColor: "#6b7280", animationDelay: "0.1s" }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ backgroundColor: "#6b7280", animationDelay: "0.2s" }}
              />
            </div>
          </div>
          <div
            className="px-3 py-2 rounded-2xl rounded-tl-md"
            style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
          >
            <span className="text-xs" style={{ color: "#6b7280" }}>
              {typingUsers.map((u) => u.userName).join(", ")}님이 입력 중...
            </span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
