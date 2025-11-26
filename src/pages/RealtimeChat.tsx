import { FaComments } from "react-icons/fa";

export function RealtimeChat() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8 pb-20 md:pb-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
          <div className="mb-6 flex justify-center">
            <FaComments className="text-8xl text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Realtime Chat
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            실시간 채팅 기능이 곧 구현될 예정입니다
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-500">Coming Soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
