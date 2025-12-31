import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { CheckCircle, Home, Sparkles, Heart } from 'lucide-react';
import Confetti from '../../components/ui/Confetti';
import useThemeStore from '../../context/themeStore';

const SuccessPage = () => {
  const { theme, applyTheme } = useThemeStore();

  // Force light mode for success page
  useEffect(() => {
    applyTheme('light');
    return () => {
      applyTheme(theme);
    };
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 relative overflow-hidden">
      {/* Confetti */}
      <Confetti />
      
      {/* Background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 orb orb-cyan"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 orb orb-purple"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full mx-4 relative"
      >
        <div 
          className="p-8 lg:p-12 text-center rounded-2xl relative overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
          }}
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative w-24 h-24 mx-auto mb-8"
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ 
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))'
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div 
              className="absolute inset-2 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: '#22c55e' }} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-display font-bold text-gradient mb-4"
          >
            Terima Kasih!
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ color: 'var(--text-muted)' }}
            className="mb-8"
          >
            Testimoni Anda telah berhasil dikirim. Kami sangat menghargai 
            waktu dan masukan yang Anda berikan.
          </motion.p>

          {/* Heart animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="flex justify-center gap-2 mb-8"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                <Heart 
                  className="w-6 h-6 fill-current"
                  style={{ color: '#f43f5e' }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Kembali ke Beranda
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;