import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Key,
  MessageSquareQuote,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  User,
  Settings,
  Home
} from 'lucide-react';
import clsx from 'clsx';
import useAuthStore from '../../context/authStore';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { path: '/admin/tokens', label: 'Invite Tokens', icon: Key },
    { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-void-950 flex">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-10 pointer-events-none" />
      
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-void-950/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-void-900/95 backdrop-blur-xl border-r border-void-800/50',
          'transform transition-transform duration-300 lg:translate-x-0 lg:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-void-800/50">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <motion.div
                className="relative w-10 h-10"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg opacity-80" />
                <div className="absolute inset-[2px] bg-void-950 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-neon-cyan" />
                </div>
              </motion.div>
              <div>
                <span className="font-display font-bold text-sm tracking-wider text-gradient block">
                  ADMIN PANEL
                </span>
                <span className="text-xs text-void-500">Testimonials</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-void-400 hover:text-white hover:bg-void-800/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                    isActive
                      ? 'bg-gradient-to-r from-neon-cyan/10 to-transparent border-l-2 border-neon-cyan text-white'
                      : 'text-void-400 hover:text-white hover:bg-void-800/50'
                  )}
                >
                  <item.icon className={clsx(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-neon-cyan' : 'group-hover:text-neon-cyan'
                  )} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto text-neon-cyan" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="px-4 py-2">
            <div className="h-px bg-gradient-to-r from-transparent via-void-700 to-transparent" />
          </div>

          {/* Quick Links */}
          <div className="px-3 py-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-void-400 hover:text-white hover:bg-void-800/50 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">View Public Site</span>
            </Link>
          </div>

          {/* User section */}
          <div className="p-4 border-t border-void-800/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center">
                <User className="w-5 h-5 text-neon-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {admin?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-void-500 truncate">
                  {admin?.email || 'admin@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-void-900/80 backdrop-blur-xl border-b border-void-800/50 flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-void-400 hover:text-white hover:bg-void-800/50 mr-4"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-void-500">Admin</span>
            <ChevronRight className="w-4 h-4 text-void-600" />
            <span className="text-white font-medium capitalize">
              {location.pathname.split('/').pop().replace('-', ' ')}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
