import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import useThemeStore from '../../context/themeStore';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showClose = true 
}) => {
  const { resolvedTheme } = useThemeStore();
  const isLightMode = resolvedTheme === 'light';

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0"
          style={{ 
            zIndex: 2147483647,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {/* Full screen backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ 
              backgroundColor: isLightMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.9)' 
            }}
            onClick={onClose}
          />
          
          {/* Modal Container with scroll */}
          <div 
            className="absolute inset-0 overflow-y-auto"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
              minHeight: '100%'
            }}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative w-full ${sizes[size]} my-auto`}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '1rem',
                boxShadow: isLightMode 
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, var(--glow-cyan) 0%, transparent 50%, var(--glow-purple) 100%)',
                  opacity: 0.1
                }}
              />
              
              {/* Glow effect on top */}
              <div 
                className="absolute top-0 left-4 right-4 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, var(--accent-cyan), transparent)`,
                  opacity: 0.5
                }}
              />
              
              {/* Header */}
              <div 
                className="relative flex items-center justify-between p-6"
                style={{ borderBottom: '1px solid var(--border-primary)' }}
              >
                <h3 className="font-display text-xl font-bold text-gradient">
                  {title}
                </h3>
                {showClose && (
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-lg transition-all"
                    style={{ 
                      color: 'var(--text-muted)',
                      backgroundColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
              
              {/* Content */}
              <div 
                className="relative p-6 overflow-y-auto"
                style={{ maxHeight: '70vh' }}
              >
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;