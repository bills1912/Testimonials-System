import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Heart, ArrowLeft } from 'lucide-react';
import Confetti from '../../components/ui/Confetti';

const SuccessPage = () => {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Mobile Header */}
      <div 
        className="sticky top-0 z-50 px-4 py-3 backdrop-blur-xl sm:hidden"
        style={{ 
          backgroundColor: 'rgba(10,10,12,0.8)',
          borderBottom: '1px solid var(--border-primary)'
        }}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="p-2 -ml-2" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Berhasil
          </span>
          <div className="w-9" />
        </div>
      </div>

      {/* Main Content - takes remaining space */}
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti */}
        <Confetti />
        
        {/* Background orbs - hidden on mobile for performance */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 orb orb-cyan hidden sm:block"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 h-48 sm:h-72 orb orb-purple hidden sm:block"
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
          className="max-w-lg w-full relative"
        >
          <div 
            className="p-6 sm:p-8 lg:p-12 text-center rounded-2xl relative overflow-hidden"
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
              className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8"
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
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#22c55e' }} />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-display font-bold text-gradient mb-3 sm:mb-4"
            >
              Terima Kasih!
            </motion.h1>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ color: 'var(--text-muted)' }}
              className="text-sm sm:text-base mb-6 sm:mb-8 px-2"
            >
              Testimoni Anda telah berhasil dikirim. Kami sangat menghargai 
              waktu dan masukan yang Anda berikan.
            </motion.p>

            {/* Heart animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="flex justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                >
                  <Heart 
                    className="w-5 h-5 sm:w-6 sm:h-6 fill-current"
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
                className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto justify-center py-3"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                Kembali ke Beranda
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;