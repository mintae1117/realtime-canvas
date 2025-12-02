import { FaMapMarkerAlt } from "react-icons/fa";

export function RealtimeLocation() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-6 rounded-full shadow-lg">
            <FaMapMarkerAlt className="text-7xl text-red-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Realtime Location
        </h1>
        <p className="text-xl text-gray-600 mb-8">실시간 위치 공유</p>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-4">
            Coming Soon
          </div>
          <p className="text-gray-500">
            실시간 위치 공유 기능이 곧 출시됩니다.
            <br />
            조금만 기다려주세요!
          </p>
        </div>
      </div>
    </div>
  );
}
