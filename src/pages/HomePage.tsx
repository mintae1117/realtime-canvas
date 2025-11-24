import { Link } from "react-router-dom";

export function HomePage() {
  const routes = [
    {
      path: "/canvas",
      title: "Realtime Canvas",
      description: "실시간 협업 캔버스",
      icon: "🎨",
    },
    {
      path: "/chat",
      title: "Realtime Chat",
      description: "실시간 채팅",
      icon: "💬",
    },
    {
      path: "/facetime",
      title: "Realtime Facetime",
      description: "실시간 화상 통화",
      icon: "📹",
    },
    {
      path: "/monitoring",
      title: "Realtime Monitoring",
      description: "실시간 모니터링",
      icon: "📊",
    },
    {
      path: "/location",
      title: "Realtime Location",
      description: "실시간 위치 공유",
      icon: "📍",
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
              <div className="text-6xl mb-4">{route.icon}</div>
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
