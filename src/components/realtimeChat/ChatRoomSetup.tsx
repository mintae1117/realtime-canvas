import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore, createChatUser } from "../../store/chatStore";
import { FaComments, FaDice, FaLightbulb, FaRocket } from "react-icons/fa";

export const ChatRoomSetup: React.FC = () => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const { setCurrentUser, setRoomId: setStoreRoomId } = useChatStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !roomId.trim()) {
      alert("이름과 방 ID를 입력해주세요.");
      return;
    }

    const user = createChatUser(name.trim());
    setCurrentUser(user);
    setStoreRoomId(roomId.trim());
    navigate(`/chat/${roomId.trim()}`);
  };

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-6">
          <div className="text-center">
            <div className="mb-2">
              <FaComments className="text-4xl text-white inline-block" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">실시간 채팅</h1>
            <p className="text-green-100 text-sm">
              친구들과 실시간으로 대화해요
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="px-5 py-6 space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
              required
            />
          </div>

          {/* Room ID Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              방 ID
            </label>
            <div className="flex flex-row gap-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="방 ID 입력"
                className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono"
                maxLength={8}
                required
              />
              <button
                type="button"
                onClick={generateRoomId}
                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all text-sm shadow-md active:scale-95"
              >
                <FaDice className="inline-block mr-1" /> 생성
              </button>
            </div>

            <div className="mt-2 p-2 bg-green-50 rounded-lg border text-xs border-green-100">
              <p className="text-green-700 flex items-start">
                <FaLightbulb className="mr-1 mt-0.5 flex-shrink-0 text-yellow-500" />
                <span>
                  같은 방 ID를 사용하면 여러 명이 함께 대화할 수 있어요
                </span>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold text-sm hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-95"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>입장하기</span>
              <FaRocket className="text-xl" />
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="px-5 pb-5 text-center text-xs text-gray-500">
          made by @mintae1117
        </div>
      </div>
    </div>
  );
};
