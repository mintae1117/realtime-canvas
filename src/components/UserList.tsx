import React from "react";
import { useCanvasStore } from "../store/canvasStore";

export const UserList: React.FC = () => {
  const { users, currentUser } = useCanvasStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">참가자</h3>
      <div className="space-y-2">
        {currentUser && (
          <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentUser.color }}
            />
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">
                {currentUser.name} (나)
              </div>
              <div className="text-xs text-gray-500">
                {currentUser.role === "teacher" ? "선생님" : "학생"}
              </div>
            </div>
          </div>
        )}
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.color }}
            />
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">
                {user.role === "teacher" ? "선생님" : "학생"}
              </div>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${
                user.isOnline ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>
        ))}
        {users.length === 0 && !currentUser && (
          <p className="text-sm text-gray-500 text-center py-4">
            참가자가 없습니다
          </p>
        )}
      </div>
    </div>
  );
};
