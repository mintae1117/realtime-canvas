import React, { useState, useRef, useEffect, useCallback } from "react";
import { IoSend } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { useChatStore } from "../../store/chatStore";
import { type ChatMessage } from "../../types/chat";

interface MessageInputProps {
  onSendMessage: (message: ChatMessage) => void;
  onTyping: () => void;
  onStopTyping: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  onStopTyping,
}) => {
  const [text, setText] = useState("");
  const { currentUser, addMessage } = useChatStore();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onStopTyping();
    }, 2000);
  }, [onTyping, onStopTyping]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!text.trim() || !currentUser) return;

    const message: ChatMessage = {
      id: uuidv4(),
      text: text.trim(),
      userId: currentUser.id,
      userName: currentUser.name,
      userColor: currentUser.color,
      timestamp: Date.now(),
    };

    addMessage(message);
    onSendMessage(message);

    setText("");
    isTypingRef.current = false;
    onStopTyping();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 IME 조합 중일 때는 Enter 키 무시
    if (e.nativeEvent.isComposing || isComposingRef.current) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    handleTyping();

    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-shrink-0 p-3 bg-white border-t border-gray-200"
    >
      <div className="flex items-center gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder="메시지 입력..."
          rows={1}
          style={{
            flex: 1,
            padding: "10px 16px",
            fontSize: "14px",
            color: "#1f2937",
            backgroundColor: "#f3f4f6",
            border: "none",
            borderRadius: "20px",
            resize: "none",
            outline: "none",
            minHeight: "40px",
            maxHeight: "100px",
            lineHeight: "20px",
          }}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          style={{
            flexShrink: 0,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: text.trim() ? "#FEE500" : "#e5e7eb",
            cursor: text.trim() ? "pointer" : "not-allowed",
          }}
        >
          <IoSend
            size={20}
            color={text.trim() ? "#1f2937" : "#9ca3af"}
            className="absolute"
          />
        </button>
      </div>
    </form>
  );
};
