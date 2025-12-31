import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquareQuote,
  Key,
  Star,
  TrendingUp,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { adminAPI } from '../../utils/api';
import LoadingScreen from '../../components/ui/LoadingScreen';
import StarRating from '../../components/ui/StarRating';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboard();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingScreen />;

  const statCards = [
    {
      label: 'Total Projects',
      value: stats?.total_projects || 0,
      icon: FolderKanban,
      color: 'cyan',
      link: '/admin/projects'
    },
    {
      label: 'Total Testimonials',
      value: stats?.total_testimonials || 0,
      icon: MessageSquareQuote,
      color: 'purple',
      link: '/admin/testimonials'
    },
    {
      label: 'Active Tokens',
      value: stats?.active_tokens || 0,
      subValue: `/ ${stats?.total_tokens || 0} total`,
      icon: Key,
      color: 'green',
      link: '/admin/tokens'
    },
    {
      label: 'Average Rating',
      value: stats?.average_rating?.toFixed(1) || '5.0',
      icon: Star,
      color: 'yellow'
    }
  ];

  const colorClasses = {
    cyan: {
      bg: 'from-neon-cyan/10 to-transparent',
      border: 'border-neon-cyan/20',
      icon: 'text-neon-cyan',
      hover: 'hover:border-neon-cyan/40'
    },
    purple: {
      bg: 'from-neon-purple/10 to-transparent',
      border: 'border-neon-purple/20',
      icon: 'text-neon-purple',
      hover: 'hover:border-neon-purple/40'
    },
    green: {
      bg: 'from-neon-green/10 to-transparent',
      border: 'border-neon-green/20',
      icon: 'text-neon-green',
      hover: 'hover:border-neon-green/40'
    },
    yellow: {
      bg: 'from-neon-yellow/10 to-transparent',
      border: 'border-neon-yellow/20',
      icon: 'text-neon-yellow',
      hover: 'hover:border-neon-yellow/40'
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-white mb-2">
            Dashboard
          </h1>
          <p className="text-void-400">
            Selamat datang! Berikut ringkasan statistik Anda.
          </p>
        </div>
        <Link to="/admin/projects" className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => {
          const colors = colorClasses[stat.color];
          const CardWrapper = stat.link ? Link : 'div';
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CardWrapper
                to={stat.link}
                className={`block card-cyber p-6 bg-gradient-to-br ${colors.bg} ${colors.border} ${stat.link ? colors.hover : ''} transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-void-800/50 ${colors.icon}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  {stat.link && (
                    <ArrowRight className="w-4 h-4 text-void-500" />
                  )}
                </div>
                <div className="font-display font-bold text-3xl text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-void-400">
                  {stat.label}
                  {stat.subValue && (
                    <span className="text-void-500 ml-1">{stat.subValue}</span>
                  )}
                </div>
              </CardWrapper>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Create Project Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/admin/projects"
            className="block card-cyber p-6 h-full group hover:border-neon-cyan/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderKanban className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Create Project
                </h3>
                <p className="text-sm text-void-400">Add a new project</p>
              </div>
            </div>
            <p className="text-void-400 text-sm mb-4">
              Start by creating a new project to organize your client testimonials.
            </p>
            <div className="flex items-center gap-2 text-neon-cyan text-sm font-medium">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

        {/* Generate Token Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/admin/tokens"
            className="block card-cyber p-6 h-full group hover:border-neon-green/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Key className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Generate Invite
                </h3>
                <p className="text-sm text-void-400">Create invite links</p>
              </div>
            </div>
            <p className="text-void-400 text-sm mb-4">
              Generate unique invite links to send to your clients for testimonials.
            </p>
            <div className="flex items-center gap-2 text-neon-green text-sm font-medium">
              <span>Generate Token</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

        {/* View Testimonials Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/admin/testimonials"
            className="block card-cyber p-6 h-full group hover:border-neon-purple/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-magenta/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquareQuote className="w-6 h-6 text-neon-purple" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Manage Reviews
                </h3>
                <p className="text-sm text-void-400">View all testimonials</p>
              </div>
            </div>
            <p className="text-void-400 text-sm mb-4">
              View, edit, and manage all client testimonials in one place.
            </p>
            <div className="flex items-center gap-2 text-neon-purple text-sm font-medium">
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Recent Testimonials */}
      {stats?.recent_testimonials?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card-cyber p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl text-white">
              Recent Testimonials
            </h3>
            <Link
              to="/admin/testimonials"
              className="text-sm text-neon-cyan hover:text-neon-purple transition-colors flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {stats.recent_testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-void-800/30 border border-void-700/50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-sm text-neon-cyan">
                    {testimonial.client_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-white truncate">
                        {testimonial.client_name}
                      </h4>
                      <p className="text-sm text-void-500">
                        {testimonial.project_name}
                      </p>
                    </div>
                    <StarRating rating={testimonial.rating} size="sm" />
                  </div>
                  <p className="text-void-400 text-sm mt-2 line-clamp-2">
                    "{testimonial.title}"
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-void-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(testimonial.created_at), 'dd MMM yyyy')}
                    </span>
                    {testimonial.is_featured && (
                      <span className="flex items-center gap-1 text-neon-yellow">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;
