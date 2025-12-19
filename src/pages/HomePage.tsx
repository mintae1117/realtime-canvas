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
      icon: <FaPaintBrush className="text-3xl" />,
      color: "from-cyan-400 to-blue-500",
    },
    {
      path: "/chat",
      title: "Realtime Chat",
      description: "실시간 채팅",
      icon: <FaComments className="text-3xl" />,
      color: "from-blue-400 to-indigo-500",
    },
    {
      path: "/facetime",
      title: "Realtime Facetime",
      description: "실시간 화상 통화",
      icon: <FaVideo className="text-3xl" />,
      color: "from-green-400 to-emerald-500",
    },
    {
      path: "/screen",
      title: "Realtime Screen Share",
      description: "실시간 화면 공유",
      icon: <FaDesktop className="text-3xl" />,
      color: "from-teal-400 to-cyan-500",
    },
    {
      path: "/monitoring",
      title: "Realtime Monitoring",
      description: "실시간 모니터링",
      icon: <FaChartBar className="text-3xl" />,
      color: "from-orange-400 to-amber-500",
    },
    {
      path: "/satellite",
      title: "Satellite Location",
      description: "실시간 위성 위치 추적",
      icon: <FaSatellite className="text-3xl" />,
      color: "from-purple-400 to-violet-500",
    },
    {
      path: "/location",
      title: "Realtime Location",
      description: "실시간 위치 공유",
      icon: <FaMapMarkerAlt className="text-3xl" />,
      color: "from-rose-400 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen min-w-[100vw] bg-slate-900 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Realtime Applications
          </h1>
          <p className="text-slate-400 text-lg">
            다양한 실시간 협업 도구를 경험해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${route.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {route.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors duration-300">
                {route.title}
              </h2>
              <p className="text-slate-400 text-sm">{route.description}</p>
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${route.color} group-hover:w-full transition-all duration-500`}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
