import React from "react";
import { useChatStore } from "../../store/chatStore";

export const ChatUserList: React.FC = () => {
  const { users, currentUser } = useChatStore();

  return (
    <div className="bg-white rounded-lg p-3">
      <h3 className="text-sm font-semibold mb-2 text-gray-700">참가자</h3>
      <div className="space-y-1">
        {currentUser && (
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentUser.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">
                {currentUser.name} (나)
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        )}
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-700 truncate">
                {user.name}
              </div>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${
                user.isOnline ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-2">
            다른 참가자가 없습니다
          </p>
        )}
      </div>
    </div>
  );
};
