import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../store';
import {
  LayoutDashboard,
  AlertCircle,
  Gauge,
  Package,
  Wrench,
  Droplet,
  ClipboardList,
  FileText,
  Users,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['all'] },
    { name: 'Complaints', href: '/complaints', icon: AlertCircle, roles: ['all'] },
    { name: 'Meter Readings', href: '/meter-readings', icon: Gauge, roles: ['all'] },
    { name: 'Assets', href: '/assets', icon: Package, roles: ['all'] },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench, roles: ['all'] },
    { name: 'Water Production', href: '/water-production', icon: Droplet, roles: ['admin', 'supervisor'] },
    { name: 'Tasks', href: '/tasks', icon: ClipboardList, roles: ['all'] },
    { name: 'Reports', href: '/reports', icon: FileText, roles: ['admin', 'supervisor'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['admin', 'supervisor'] },
  ];

  const filteredNavigation = navigation.filter(
    (item) => item.roles.includes('all') || item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-blue-900 text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-800">
          <h1 className="text-xl font-bold whitespace-nowrap">Water Utility MIS</h1>
        </div>

        <nav className="mt-6 px-3">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800/50'
                }`}
              >
                <Icon size={20} />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <User size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
