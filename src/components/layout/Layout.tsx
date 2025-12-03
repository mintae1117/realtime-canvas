import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IoHomeOutline,
  IoColorPaletteOutline,
  IoChatbubbleEllipsesOutline,
  IoVideocamOutline,
  IoStatsChartOutline,
  IoLocationOutline,
  IoPlanetOutline,
} from "react-icons/io5";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const routes = [
    { path: "/", icon: IoHomeOutline, label: "홈" },
    { path: "/canvas", icon: IoColorPaletteOutline, label: "캔버스" },
    { path: "/chat", icon: IoChatbubbleEllipsesOutline, label: "채팅" },
    { path: "/facetime", icon: IoVideocamOutline, label: "화상통화" },
    { path: "/monitoring", icon: IoStatsChartOutline, label: "모니터링" },
    { path: "/satellite", icon: IoPlanetOutline, label: "위성위치" },
    { path: "/location", icon: IoLocationOutline, label: "위치공유" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden relative">
      {/* Desktop Mini Navbar - 왼쪽 하단에 최소화된 상태 */}
      <div className="hidden md:block fixed bottom-4 left-4 z-40">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-2">
          <nav className="flex flex-col gap-1">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`
                    group relative flex items-center justify-center p-2 rounded-xl
                    transition-all duration-200
                    ${
                      isActive(route.path)
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }
                  `}
                >
                  <Icon className="text-xl" />
                  {/* Tooltip */}
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {route.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content - 모바일에서 하단 네비게이션 영역만큼 padding-bottom 추가 */}
      <main className="flex-1 overflow-auto w-full pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Footer Navigation - 모바일에서만 표시, sticky로 변경 */}
      <footer className="md:hidden sticky bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
        <nav className="flex justify-around items-center h-16">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.path}
                to={route.path}
                className={`
                  flex flex-col items-center justify-center flex-1 h-full
                  transition-all duration-200
                  ${isActive(route.path) ? "text-blue-500" : "text-gray-500"}
                `}
              >
                <Icon className="text-xl mb-1" />
                <span className="text-xs">{route.label}</span>
              </Link>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}
