import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const PublicLayout = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/testimonials', label: 'Testimonials', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-void-950 flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-0 w-[600px] h-[600px] orb orb-cyan opacity-30 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] orb orb-purple opacity-30 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-50 border-b border-void-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
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
              <span className="font-display font-bold text-xl tracking-wider text-gradient hidden sm:block">
                TESTIMONIALS
              </span>
            </Link>
            
            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
                    location.pathname === link.path
                      ? 'bg-neon-cyan/10 text-neon-cyan'
                      : 'text-void-300 hover:text-white hover:bg-void-800/50'
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  <span className="font-medium hidden sm:block">{link.label}</span>
                </Link>
              ))}
              
              {/* Admin Link */}
              <Link
                to="/admin"
                className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-void-800/50 text-void-300 hover:text-neon-purple hover:bg-void-700/50 transition-all duration-300 border border-void-700/50"
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
      <footer className="relative border-t border-void-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-neon-cyan" />
              <span className="text-void-400 text-sm">
                © {new Date().getFullYear()} Testimonial System. All rights reserved.
              </span>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 rounded-lg text-void-500 hover:text-neon-cyan hover:bg-void-800/50 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg text-void-500 hover:text-neon-cyan hover:bg-void-800/50 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg text-void-500 hover:text-neon-cyan hover:bg-void-800/50 transition-colors"
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
