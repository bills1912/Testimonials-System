import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-void-950 flex items-center justify-center z-50">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 orb orb-cyan animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 orb orb-purple animate-pulse-slow" />
      
      <div className="relative flex flex-col items-center gap-8">
        {/* Hexagonal loader */}
        <motion.div
          className="relative w-24 h-24"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-2 border-neon-cyan/30 hexagon" />
          <motion.div
            className="absolute inset-2 border-2 border-neon-purple/50 hexagon"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 bg-gradient-to-br from-neon-cyan to-neon-purple hexagon"
            animate={{ scale: [1, 0.8, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <motion.h2
            className="font-display text-xl tracking-widest text-gradient"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            INITIALIZING
          </motion.h2>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-neon-cyan"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
