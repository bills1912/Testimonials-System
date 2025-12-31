import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#00f0ff', '#9d00ff', '#ff00aa', '#00ff88', '#ffee00'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: -20,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: '100vh',
            opacity: [1, 1, 0],
            rotate: 360,
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
