import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import useThemeStore from '../../context/themeStore';

const ThemeSwitch = ({ className = '' }) => {
  const { theme, setTheme, resolvedTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[1];
  const CurrentIcon = currentTheme.icon;
  const isLightMode = resolvedTheme === 'light';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-all duration-200"
        style={{
          backgroundColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
          border: `1px solid var(--border-primary)`,
          color: 'var(--text-muted)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`Theme: ${currentTheme.label}`}
      >
        <CurrentIcon className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 py-1 z-50 rounded-lg shadow-xl"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: `1px solid var(--border-primary)`,
            }}
          >
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.value;
              
              return (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors"
                  style={{
                    backgroundColor: isActive 
                      ? (isLightMode ? 'rgba(8,145,178,0.1)' : 'rgba(0,240,255,0.1)')
                      : 'transparent',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTheme"
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'var(--accent-cyan)' }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitch;