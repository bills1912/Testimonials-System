import { motion } from 'framer-motion';
import { Quote, Star, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import StarRating from './StarRating';

const TestimonialCard = ({ testimonial, featured = false, delay = 0 }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={`relative card-cyber p-6 group ${featured ? 'border-neon-cyan/30' : ''}`}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute -top-3 left-6">
          <span className="px-3 py-1 text-xs font-display font-bold uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 rounded-full">
            Featured
          </span>
        </div>
      )}
      
      {/* Quote icon */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className="w-12 h-12 text-neon-cyan" />
      </div>
      
      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} size="md" />
      </div>
      
      {/* Title */}
      <h4 className="font-display font-bold text-lg text-white mb-3 line-clamp-2">
        "{testimonial.title}"
      </h4>
      
      {/* Content */}
      <p className="text-void-300 leading-relaxed mb-6 line-clamp-4">
        {testimonial.content}
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-4 pt-4 border-t border-void-700/50">
        {/* Avatar */}
        {testimonial.client_avatar ? (
          <img
            src={testimonial.client_avatar}
            alt={testimonial.client_name}
            className="w-12 h-12 rounded-full object-cover border-2 border-neon-cyan/30"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center">
            <span className="font-display font-bold text-sm text-neon-cyan">
              {getInitials(testimonial.client_name)}
            </span>
          </div>
        )}
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h5 className="font-semibold text-white truncate">
            {testimonial.client_name}
          </h5>
          <p className="text-sm text-void-400 truncate">
            {testimonial.client_role && `${testimonial.client_role}`}
            {testimonial.client_role && testimonial.client_company && ' @ '}
            {testimonial.client_company}
          </p>
        </div>
        
        {/* Project badge */}
        <div className="hidden sm:block">
          <span className="px-2 py-1 text-xs font-mono text-neon-purple bg-neon-purple/10 rounded border border-neon-purple/20">
            {testimonial.project_name}
          </span>
        </div>
      </div>
      
      {/* Date */}
      <div className="absolute bottom-2 right-4 flex items-center gap-1 text-xs text-void-500">
        <Calendar className="w-3 h-3" />
        {format(new Date(testimonial.created_at), 'dd MMM yyyy')}
      </div>
      
      {/* Decorative corner lines */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neon-cyan/20 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-neon-purple/20 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default TestimonialCard;
