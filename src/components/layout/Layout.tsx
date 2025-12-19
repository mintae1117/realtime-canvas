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
  IoDesktopOutline,
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
    { path: "/screen", icon: IoDesktopOutline, label: "화면공유" },
    { path: "/monitoring", icon: IoStatsChartOutline, label: "모니터링" },
    { path: "/satellite", icon: IoPlanetOutline, label: "위성위치" },
    { path: "/location", icon: IoLocationOutline, label: "위치공유" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden relative bg-slate-900">
      {/* Desktop Mini Navbar - 왼쪽 하단에 최소화된 상태 */}
      <div className="hidden md:block fixed bottom-4 left-4 z-40">
        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50 p-2">
          <nav className="flex flex-col gap-1">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`
                    group relative flex items-center justify-center p-2.5 rounded-xl
                    transition-all duration-300
                    ${
                      isActive(route.path)
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                        : "text-slate-400 hover:bg-slate-700/50 hover:text-cyan-400"
                    }
                  `}
                >
                  <Icon className="text-xl" />
                  {/* Tooltip */}
                  <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-cyan-400 text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-slate-700/50 shadow-lg">
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

      {/* Mobile Footer Navigation - 모바일에서만 표시 */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md border-t border-slate-700/50 z-20">
        <nav className="flex justify-around items-center h-16">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.path}
                to={route.path}
                className={`
                  flex flex-col items-center justify-center flex-1 h-full
                  transition-all duration-300
                  ${
                    isActive(route.path)
                      ? "text-cyan-400"
                      : "text-slate-500 hover:text-slate-300"
                  }
                `}
              >
                <div
                  className={`
                    p-1.5 rounded-lg transition-all duration-300
                    ${isActive(route.path) ? "bg-cyan-500/20" : ""}
                  `}
                >
                  <Icon className="text-xl" />
                </div>
                <span className="text-xs mt-0.5 font-medium">
                  {route.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}
