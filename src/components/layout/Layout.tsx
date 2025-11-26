import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IoHomeOutline,
  IoColorPaletteOutline,
  IoChatbubbleEllipsesOutline,
  IoVideocamOutline,
  IoStatsChartOutline,
  IoLocationOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const routes = [
    { path: "/", icon: IoHomeOutline, label: "홈" },
    { path: "/canvas", icon: IoColorPaletteOutline, label: "캔버스" },
    { path: "/chat", icon: IoChatbubbleEllipsesOutline, label: "채팅" },
    { path: "/facetime", icon: IoVideocamOutline, label: "화상통화" },
    { path: "/monitoring", icon: IoStatsChartOutline, label: "모니터링" },
    { path: "/location", icon: IoLocationOutline, label: "위치공유" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      {/* Mobile Menu Button - 모바일에서만 표시, 사이드바가 닫혔을 때만 */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <IoMenuOutline className="text-2xl text-gray-700" />
        </button>
      )}

      {/* Mobile Sidebar - 모바일에서만 풀 사이드바 */}
      <aside
        className={`
          md:hidden
          fixed
          ${isSidebarOpen ? "flex" : "hidden"}
          flex-col
          bg-white
          w-64
          h-full
          shadow-xl
          z-40
          transition-all
          duration-300
        `}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg transition-colors bg-white"
          >
            <IoCloseOutline className="text-2xl text-gray-700" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.path}
                to={route.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 mb-2 rounded-lg
                  transition-all duration-200
                  ${
                    isActive(route.path)
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <Icon className="text-xl" />
                <span className="font-medium">{route.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            Realtime Apps v1.0
          </p>
        </div>
      </aside>

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

      {/* Overlay for mobile - 사이드바가 열렸을 때 배경 어둡게 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">{children}</main>

      {/* Mobile Footer Navigation - 모바일에서만 표시 */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
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
