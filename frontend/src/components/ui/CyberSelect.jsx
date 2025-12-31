import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import useThemeStore from '../../context/themeStore';

const CyberSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  icon: Icon,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const { resolvedTheme } = useThemeStore();
  const isLightMode = resolvedTheme === 'light';

  const selectedOption = options.find(opt => opt.value === value || opt.value === String(value));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`} style={{ zIndex: isOpen ? 9999 : 1 }}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300"
        style={{
          backgroundColor: 'var(--bg-input)',
          border: `1px solid ${isOpen ? 'var(--accent-cyan)' : 'var(--border-primary)'}`,
          boxShadow: isOpen ? '0 0 20px var(--glow-cyan)' : 'none',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {Icon && (
          <div className="flex-shrink-0 pointer-events-none">
            <Icon className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
        <span 
          className="flex-1 truncate"
          style={{ color: selectedOption ? 'var(--text-primary)' : 'var(--text-placeholder)' }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute w-full mt-2 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden"
            style={{
              zIndex: 99999,
              backgroundColor: 'var(--bg-secondary)',
              border: `1px solid var(--border-primary)`,
              boxShadow: `0 0 40px var(--glow-cyan), 0 20px 60px var(--shadow-color)`
            }}
          >
            <div className="py-2 max-h-64 overflow-y-auto">
              {options.map((option, index) => {
                const isSelected = option.value === value || option.value === String(value);
                
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: isSelected 
                        ? (isLightMode ? 'rgba(8,145,178,0.1)' : 'rgba(0,240,255,0.05)')
                        : 'transparent',
                    }}
                  >
                    <div 
                      className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200"
                      style={{
                        border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-secondary)'}`,
                        backgroundColor: isSelected 
                          ? (isLightMode ? 'rgba(8,145,178,0.2)' : 'rgba(0,240,255,0.2)')
                          : 'transparent',
                      }}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3" style={{ color: 'var(--accent-cyan)' }} />
                      )}
                    </div>
                    
                    <span 
                      className="flex-1 transition-colors duration-200"
                      style={{ 
                        color: isSelected ? 'var(--accent-cyan)' : 'var(--text-tertiary)',
                        fontWeight: isSelected ? 500 : 400,
                      }}
                    >
                      {option.label}
                    </span>

                    {option.badge && (
                      <span 
                        className="px-2 py-0.5 text-xs rounded-full"
                        style={{ 
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {option.badge}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberSelect;