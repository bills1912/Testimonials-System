import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const StarRating = ({ 
  rating, 
  onChange, 
  readonly = true, 
  size = 'md',
  showLabel = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleClick = (value) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <motion.button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            disabled={readonly}
            className={clsx(
              'transition-all duration-200',
              !readonly && 'cursor-pointer hover:scale-110',
              readonly && 'cursor-default'
            )}
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
          >
            <Star
              className={clsx(
                sizes[size],
                'transition-all duration-200',
                value <= rating
                  ? 'fill-neon-yellow text-neon-yellow drop-shadow-[0_0_8px_rgba(255,238,0,0.5)]'
                  : 'fill-transparent text-void-600'
              )}
            />
          </motion.button>
        ))}
      </div>
      {showLabel && (
        <span className="font-mono text-sm text-void-400">
          {rating}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;
