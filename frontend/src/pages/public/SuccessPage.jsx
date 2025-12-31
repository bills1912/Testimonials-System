import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Sparkles, Heart } from 'lucide-react';
import Confetti from '../../components/ui/Confetti';

const SuccessPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 relative overflow-hidden">
      {/* Background effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 orb orb-cyan"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 orb orb-purple"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full mx-4 relative"
      >
        <div className="card-cyber p-8 lg:p-12 text-center relative overflow-hidden">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative w-24 h-24 mx-auto mb-8"
          >
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-cyan/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Middle ring */}
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-neon-green/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Inner circle with icon */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-void-950" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="font-display font-bold text-3xl text-white mb-4">
              Terima Kasih!
            </h1>
            
            <p className="text-void-300 mb-8 leading-relaxed">
              Testimoni Anda telah berhasil dikirim dan akan segera ditampilkan di halaman publik.
              Kami sangat menghargai waktu dan feedback Anda.
            </p>

            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                <Sparkles className="w-5 h-5 text-neon-yellow" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-6 h-6 text-neon-magenta" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                <Sparkles className="w-5 h-5 text-neon-yellow" />
              </motion.div>
            </div>

            {/* Action button */}
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </motion.div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-neon-green/30 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-neon-cyan/30 rounded-br-2xl" />
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
