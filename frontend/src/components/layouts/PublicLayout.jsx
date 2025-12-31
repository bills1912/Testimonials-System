import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Home,
  Shield,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import clsx from 'clsx';
import useThemeStore from '../../context/themeStore';
import ThemeSwitch from '../ui/ThemeSwitch';

const PublicLayout = () => {
  const location = useLocation();
  const { initTheme, resolvedTheme } = useThemeStore();
  
  // Initialize theme on mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);
  
  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/testimonials', label: 'Testimonials', icon: MessageSquare },
  ];

  const isLightMode = resolvedTheme === 'light';

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed top-0 left-0 w-[600px] h-[600px] orb orb-cyan pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] orb orb-purple pointer-events-none" />
      
      {/* Navigation */}
      <nav 
        className="relative z-50"
        style={{ borderBottom: `1px solid var(--border-primary)` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className="relative w-10 h-10"
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
              <span className="font-display font-bold text-xl tracking-wider text-gradient hidden sm:block">
                TESTIMONIALS
              </span>
            </Link>
            
            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: isActive 
                        ? (isLightMode ? 'rgba(8,145,178,0.1)' : 'rgba(0,240,255,0.1)')
                        : 'transparent',
                      color: isActive ? 'var(--accent-cyan)' : 'var(--text-tertiary)',
                    }}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="font-medium hidden sm:block">{link.label}</span>
                  </Link>
                );
              })}
              
              {/* Theme Switch */}
              <ThemeSwitch className="ml-2" />
              
              {/* Admin Link */}
              <Link
                to="/admin"
                className="ml-2 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid var(--border-primary)`,
                  color: 'var(--text-tertiary)',
                }}
              >
                <Shield className="w-4 h-4" />
                <span className="font-medium hidden sm:block">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="relative flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer 
        className="relative py-8"
        style={{ borderTop: `1px solid var(--border-primary)` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                © {new Date().getFullYear()} Testimonial System. All rights reserved.
              </span>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;