import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCanvasStore, createUser } from "../../store/canvasStore";
import { type UserRole } from "../../types/canvas";
import {
  FaBook,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaDice,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";

export const RoomSetup: React.FC = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [roomId, setRoomId] = useState("");
  const { setCurrentUser, setRoomId: setStoreRoomId } = useCanvasStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !roomId.trim()) {
      alert("이름과 방 ID를 입력해주세요.");
      return;
    }

    const user = createUser(name.trim(), role);
    setCurrentUser(user);
    setStoreRoomId(roomId.trim());
    navigate(`/canvas/${roomId.trim()}`);
  };

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md overflow-hidden">
        {/* Header Section - 줄임 */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-6">
          <div className="text-center">
            <div className="mb-2">
              <FaBook className="text-4xl text-white inline-block" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">
              실시간 학습 캔버스
            </h1>
            <p className="text-blue-100 text-sm">
              선생님과 학생이 함께 문제를 풀어요
            </p>
          </div>
        </div>

        {/* Form Section - 전체 padding 감소 */}
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
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              역할
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`px-3 py-3 rounded-lg font-semibold transition-all text-sm ${
                  role === "teacher"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <FaChalkboardTeacher className="text-xl" />
                  <span>선생님</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("student")}
                className={`px-3 py-3 rounded-lg font-semibold transition-all text-sm ${
                  role === "student"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <FaUserGraduate className="text-xl" />
                  <span>학생</span>
                </div>
              </button>
            </div>
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
                className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
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

            <div className="mt-2 p-2 bg-blue-50 rounded-lg border text-xs border-blue-100">
              <p className="text-blue-700 flex items-start">
                <FaLightbulb className="mr-1 mt-0.5 flex-shrink-0 text-yellow-500" />
                <span>
                  같은 방 ID를 사용하면 여러 명이 함께 학습할 수 있어요
                </span>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-bold text-sm hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-95"
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
