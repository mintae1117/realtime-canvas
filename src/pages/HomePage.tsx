import { Link } from "react-router-dom";
import {
  FaPaintBrush,
  FaComments,
  FaVideo,
  FaChartBar,
  FaMapMarkerAlt,
  FaSatellite,
  FaDesktop,
} from "react-icons/fa";

export function HomePage() {
  const routes = [
    {
      path: "/canvas",
      title: "Realtime Canvas",
      description: "실시간 협업 캔버스",
      icon: <FaPaintBrush className="text-6xl text-indigo-500" />,
    },
    {
      path: "/chat",
      title: "Realtime Chat",
      description: "실시간 채팅",
      icon: <FaComments className="text-6xl text-blue-500" />,
    },
    {
      path: "/facetime",
      title: "Realtime Facetime",
      description: "실시간 화상 통화",
      icon: <FaVideo className="text-6xl text-green-500" />,
    },
    {
      path: "/screen",
      title: "Realtime Screen Share",
      description: "실시간 화면 공유",
      icon: <FaDesktop className="text-6xl text-cyan-500" />,
    },
    {
      path: "/monitoring",
      title: "Realtime Monitoring",
      description: "실시간 모니터링",
      icon: <FaChartBar className="text-6xl text-orange-500" />,
    },
    {
      path: "/satellite",
      title: "Satellite Location",
      description: "실시간 위성 위치 추적",
      icon: <FaSatellite className="text-6xl text-purple-500" />,
    },
    {
      path: "/location",
      title: "Realtime Location",
      description: "실시간 위치 공유",
      icon: <FaMapMarkerAlt className="text-6xl text-red-500" />,
    },
  ];

  return (
    <div className="min-h-screen min-w-[100vw] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <h1 className="text-5xl font-bold text-center mb-4 text-gray-800">
          Realtime Applications
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          다양한 실시간 협업 도구를 경험해보세요
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 hover:scale-105 transform"
            >
              <div className="mb-4">{route.icon}</div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {route.title}
              </h2>
              <p className="text-gray-600">{route.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
