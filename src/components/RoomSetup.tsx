import React, { useState } from "react";
import { useCanvasStore, createUser } from "../store/canvasStore";
import { type UserRole } from "../types/canvas";

interface RoomSetupProps {
  onJoinRoom: () => void;
}

export const RoomSetup: React.FC<RoomSetupProps> = ({ onJoinRoom }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [roomId, setRoomId] = useState("");
  const { setCurrentUser, setRoomId: setStoreRoomId } = useCanvasStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !roomId.trim()) {
      alert("이름과 방 ID를 입력해주세요.");
      return;
    }

    const user = createUser(name.trim(), role);
    setCurrentUser(user);
    setStoreRoomId(roomId.trim());
    onJoinRoom();
  };

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Desktop & Mobile Responsive Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 sm:px-8 sm:py-10 md:py-12">
          <div className="text-center">
            <div className="mb-3 sm:mb-4">
              <span className="text-5xl sm:text-6xl md:text-7xl">📚</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              실시간 학습 캔버스
            </h1>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg">
              선생님과 학생이 함께 문제를 풀어요
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 space-y-5 sm:space-y-6"
        >
          {/* Name Input */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3 sm:px-5 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
              역할
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`px-3 py-3 sm:px-4 sm:py-4 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                  role === "teacher"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-2xl sm:text-3xl">👨‍🏫</span>
                  <span>선생님</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`px-3 py-3 sm:px-4 sm:py-4 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                  role === "student"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-2xl sm:text-3xl">👨‍🎓</span>
                  <span>학생</span>
                </div>
              </button>
            </div>
          </div>

          {/* Room ID Input */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
              방 ID
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="방 ID 입력"
                className="flex-1 px-4 py-3 sm:px-5 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                maxLength={8}
                required
              />
              <button
                type="button"
                onClick={generateRoomId}
                className="px-5 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95"
              >
                🎲 생성
              </button>
            </div>
            <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs sm:text-sm text-blue-700 flex items-start">
                <span className="mr-2 mt-0.5">💡</span>
                <span>
                  같은 방 ID를 사용하면 여러 명이 함께 학습할 수 있어요
                </span>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 sm:mt-8 px-6 py-4 sm:py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-base sm:text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>입장하기</span>
              <span className="text-xl sm:text-2xl">🚀</span>
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="text-center text-xs sm:text-sm text-gray-500">
            <p>made by @mintae1117</p>
          </div>
        </div>
      </div>
    </div>
  );
};
