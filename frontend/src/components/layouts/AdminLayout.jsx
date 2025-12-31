import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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
  Home,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import clsx from 'clsx';
import useAuthStore from '../../context/authStore';
import useThemeStore from '../../context/themeStore';
import ThemeSwitch from '../ui/ThemeSwitch';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();
  const { initTheme, resolvedTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);

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

  const isLightMode = resolvedTheme === 'light';

  return (
    <div 
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex flex-col backdrop-blur-xl transition-all duration-300',
          sidebarCollapsed ? 'w-20' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ 
          backgroundColor: isLightMode ? 'rgba(255,255,255,0.95)' : 'rgba(28,28,30,0.95)',
          borderRight: `1px solid var(--border-primary)`
        }}
      >
        {/* Logo area */}
        <div 
          className="h-16 flex items-center justify-between px-4"
          style={{ borderBottom: `1px solid var(--border-primary)` }}
        >
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <motion.div
              className="relative w-10 h-10 flex-shrink-0"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg opacity-80" />
              <div 
                className="absolute inset-[2px] rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-primary)' }}
              >
                <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} />
              </div>
            </motion.div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="font-display font-bold text-sm uppercase tracking-wider text-gradient">
                  Admin Panel
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Testimonials</p>
              </motion.div>
            )}
          </Link>
          
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
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
                  sidebarCollapsed && 'justify-center px-2'
                )}
                style={{
                  backgroundColor: isActive 
                    ? (isLightMode ? 'rgba(8,145,178,0.1)' : 'rgba(0,240,255,0.1)')
                    : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={clsx('w-5 h-5 flex-shrink-0', isActive && 'drop-shadow-lg')} />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {!sidebarCollapsed && isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div style={{ borderTop: `1px solid var(--border-primary)` }}>
          {/* Collapse toggle - Desktop only */}
          <div className="hidden lg:block p-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={clsx(
                'flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors hover:opacity-80',
                sidebarCollapsed && 'justify-center px-2'
              )}
              style={{ color: 'var(--text-muted)' }}
            >
              {sidebarCollapsed ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <>
                  <PanelLeftClose className="w-5 h-5" />
                  <span className="text-sm">Collapse</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Links */}
          <div className="px-3 py-2">
            <Link
              to="/"
              className={clsx(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:opacity-80',
                sidebarCollapsed && 'justify-center px-2'
              )}
              style={{ color: 'var(--text-muted)' }}
              title={sidebarCollapsed ? 'View Public Site' : undefined}
            >
              <Home className="w-4 h-4" />
              {!sidebarCollapsed && <span className="text-sm">View Public Site</span>}
            </Link>
          </div>

          {/* User section */}
          <div className="p-4">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(157,0,255,0.2))',
                    border: '1px solid var(--glow-cyan)'
                  }}
                >
                  <User className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {admin?.full_name || 'Admin'}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {admin?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
            )}
            
            {sidebarCollapsed && (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(157,0,255,0.2))',
                  border: '1px solid var(--glow-cyan)'
                }}
                title={admin?.full_name || 'Admin'}
              >
                <User className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} />
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className={clsx(
                'flex items-center gap-2 w-full px-4 py-2 rounded-lg transition-colors hover:bg-red-500/10',
                sidebarCollapsed && 'justify-center px-2'
              )}
              style={{ color: '#ef4444' }}
              title={sidebarCollapsed ? 'Logout' : undefined}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div 
        className={clsx(
          'flex-1 flex flex-col min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      >
        {/* Top bar */}
        <header 
          className="sticky top-0 z-30 h-16 backdrop-blur-xl flex items-center px-4 lg:px-8"
          style={{ 
            backgroundColor: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(28,28,30,0.8)',
            borderBottom: `1px solid var(--border-primary)`
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg mr-4 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Admin</span>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-placeholder)' }} />
            <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
              {location.pathname.split('/').pop().replace('-', ' ')}
            </span>
          </div>
          
          {/* Spacer */}
          <div className="flex-1" />
          
          {/* Theme Switch */}
          <ThemeSwitch />
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