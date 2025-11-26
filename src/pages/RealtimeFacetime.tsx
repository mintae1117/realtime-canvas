import { FaVideo } from "react-icons/fa";

export function RealtimeFacetime() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-8 pb-20 md:pb-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
          <div className="mb-6 flex justify-center">
            <FaVideo className="text-8xl text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Realtime Facetime
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            실시간 화상 통화 기능이 곧 구현될 예정입니다
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-500">Coming Soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
