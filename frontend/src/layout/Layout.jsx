import React, { useState } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../features/auth/authStore";
import {
  LayoutDashboard,
  Users,
  LogOut,
  UserCog,
  SquareArrowLeft,
} from "lucide-react";
import { Button } from "../components/Button";
import { FullPageLoader } from "../components/Loaders";
import ProfileDropdown from "../components/ProfileDropdown";

const ProtectedRoute = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(true);
  const { isAuthenticated, isLoading, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-gray-100 flex">
      {/* Sidebar / Navigation */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${isOpenSidebar ? "w-64" : "w-0"} h-screen sticky top-0 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200`}
      >
        <div className="flex h-16 items-center justify-center border-b border-gray-200 bg-white px-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            CRMaster
          </h1>
        </div>
        <div className="flex flex-col p-4 space-y-2 h-[calc(100vh-4rem)]">
          <div className="px-3 py-3 text-sm font-medium text-gray-700 bg-blue-50 rounded-lg border border-blue-100 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">
                  {user?.name}
                </div>
                <div className="text-xs text-blue-600 capitalize">
                  {user?.role}
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            <Button
              variant={isActive("/") ? "secondary" : "ghost"}
              className={`justify-start w-full transition-all duration-200 ${
                isActive("/")
                  ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => navigate("/")}
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={isActive("/leads") ? "secondary" : "ghost"}
              className={`justify-start w-full transition-all duration-200 ${
                isActive("/leads")
                  ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => navigate("/leads")}
            >
              <Users className="mr-3 h-4 w-4" />
              Leads
            </Button>
            {user?.role === "admin" && (
              <Button
                variant={isActive("/staff") ? "secondary" : "ghost"}
                className={`justify-start w-full transition-all duration-200 ${
                  isActive("/staff")
                    ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => navigate("/staff")}
              >
                <UserCog className="mr-3 h-4 w-4" />
                Staff
              </Button>
            )}
          </nav>

          <div className="pt-4 border-t border-gray-200 mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-all duration-200 hover:shadow-sm"
              onClick={logout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 flex justify-between items-center z-10">
          <button className="px-4 cursor-pointer" onClick={toggleSidebar}>
            <SquareArrowLeft className="text-blue-600" />
          </button>

          <ProfileDropdown user={user} onLogout={logout} />
        </header>
        <main className="h-[200vh] p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
