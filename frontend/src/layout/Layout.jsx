import React from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../features/auth/authStore';
import { LayoutDashboard, Users, LogOut, UserCog } from 'lucide-react';
import { Button } from '../components/Button';

const ProtectedRoute = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar / Navigation */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                <div className="flex h-16 items-center justify-center border-b px-4">
                    <h1 className="text-xl font-bold text-primary-600">CRMaster</h1>
                </div>
                <div className="flex flex-col p-4 space-y-2">
                    <div className="px-2 py-2 text-sm font-semibold text-gray-500">
                        Welcome, {user?.name} ({user?.role})
                    </div>
                    {/* Dashboard - logic pending, redirecting to leads for now or just placeholder */}
                    <Button
                        variant={isActive('/') ? 'secondary' : 'ghost'}
                        className="justify-start"
                        onClick={() => navigate('/')}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                    <Button
                        variant={isActive('/leads') ? 'secondary' : 'ghost'}
                        className="justify-start"
                        onClick={() => navigate('/leads')}
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Leads
                    </Button>

                    {user?.role === 'admin' && (
                        <Button
                            variant={isActive('/staff') ? 'secondary' : 'ghost'}
                            className="justify-start"
                            onClick={() => navigate('/staff')}
                        >
                            <UserCog className="mr-2 h-4 w-4" />
                            Staff
                        </Button>
                    )}

                    <div className="mt-auto pt-4 border-t">
                        <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700" onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pl-64">
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedRoute;
