import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  MessageSquare,
  FolderKanban,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Quote,
  ArrowRight
} from 'lucide-react';
import { publicAPI } from '../../utils/api';
import TestimonialCard from '../../components/ui/TestimonialCard';
import LoadingScreen from '../../components/ui/LoadingScreen';

const HomePage = () => {
  const [stats, setStats] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, testimonialsRes] = await Promise.all([
          publicAPI.getStats(),
          publicAPI.getFeaturedTestimonials(6)
        ]);
        setStats(statsRes.data);
        setTestimonials(testimonialsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingScreen />;

  const statCards = [
    {
      label: 'Total Projects',
      value: stats?.total_projects || 0,
      icon: FolderKanban,
      color: 'cyan'
    },
    {
      label: 'Client Reviews',
      value: stats?.total_testimonials || 0,
      icon: MessageSquare,
      color: 'purple'
    },
    {
      label: 'Average Rating',
      value: stats?.average_rating?.toFixed(1) || '5.0',
      icon: Star,
      color: 'yellow'
    },
    {
      label: 'Satisfaction Rate',
      value: `${stats?.satisfaction_rate || 100}%`,
      icon: TrendingUp,
      color: 'green'
    }
  ];

  const colorClasses = {
    cyan: 'from-neon-cyan/20 to-transparent border-neon-cyan/30 text-neon-cyan',
    purple: 'from-neon-purple/20 to-transparent border-neon-purple/30 text-neon-purple',
    yellow: 'from-neon-yellow/20 to-transparent border-neon-yellow/30 text-neon-yellow',
    green: 'from-neon-green/20 to-transparent border-neon-green/30 text-neon-green'
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Animated background orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 orb orb-cyan"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 orb orb-purple"
          animate={{ 
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium text-neon-cyan">
                Professional Testimonial Management
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl mb-6 tracking-tight"
            >
              <span className="text-white">Build Trust with</span>
              <br />
              <span className="text-gradient">Authentic Reviews</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg sm:text-xl text-void-300 mb-10"
            >
              Collect, manage, and showcase genuine client testimonials with our 
              invite-only system. No fake reviews, just real feedback.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/testimonials" className="btn-primary inline-flex items-center gap-2">
                View All Testimonials
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/admin" className="btn-secondary inline-flex items-center gap-2">
                Admin Dashboard
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`card-cyber p-6 bg-gradient-to-br ${colorClasses[stat.color]}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <stat.icon className="w-8 h-8" />
                  <span className="font-mono text-xs text-void-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="font-display font-bold text-3xl lg:text-4xl text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-void-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="flex items-end justify-between mb-12">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 mb-4"
                >
                  <Quote className="w-5 h-5 text-neon-cyan" />
                  <span className="text-sm font-medium text-neon-cyan uppercase tracking-wider">
                    Client Testimonials
                  </span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="section-title"
                >
                  What Clients Say
                </motion.h2>
              </div>
              <Link
                to="/testimonials"
                className="hidden sm:flex items-center gap-2 text-neon-cyan hover:text-neon-purple transition-colors"
              >
                <span className="font-medium">View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Testimonial grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  featured={testimonial.is_featured}
                  delay={index * 0.1}
                />
              ))}
            </div>

            {/* Mobile view all link */}
            <div className="mt-8 text-center sm:hidden">
              <Link to="/testimonials" className="btn-secondary">
                View All Testimonials
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title mb-4"
            >
              How It Works
            </motion.h2>
            <p className="text-void-400 max-w-2xl mx-auto">
              Our invite-only system ensures authenticity. Only real clients can leave reviews.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Project',
                description: 'Admin creates a new project in the dashboard with client details.'
              },
              {
                step: '02',
                title: 'Generate Invite',
                description: 'A unique invite link is generated and sent to the client.'
              },
              {
                step: '03',
                title: 'Submit Review',
                description: 'Client clicks the link, writes their testimonial, and submits.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative card-cyber p-8 text-center group"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                    <span className="font-display font-bold text-xs text-void-950">
                      {item.step}
                    </span>
                  </div>
                </div>

                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-4 left-full w-full h-px bg-gradient-to-r from-neon-cyan/30 to-transparent" />
                )}

                <h3 className="font-display font-bold text-xl text-white mt-4 mb-3">
                  {item.title}
                </h3>
                <p className="text-void-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-cyber p-8 lg:p-12 relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-purple/10" />
            
            <h2 className="font-display font-bold text-2xl lg:text-4xl text-white mb-4 relative">
              Ready to Start Collecting Testimonials?
            </h2>
            <p className="text-void-300 mb-8 max-w-xl mx-auto relative">
              Join hundreds of professionals who trust our system for authentic client feedback.
            </p>
            <Link to="/admin/register" className="btn-primary inline-flex items-center gap-2 relative">
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
