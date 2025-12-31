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
      gradient: 'linear-gradient(135deg, rgba(0,240,255,0.15), transparent)',
      iconColor: 'var(--accent-cyan)',
      link: '/admin/projects'
    },
    {
      label: 'Total Testimonials',
      value: stats?.total_testimonials || 0,
      icon: MessageSquareQuote,
      gradient: 'linear-gradient(135deg, rgba(157,0,255,0.15), transparent)',
      iconColor: 'var(--accent-purple)',
      link: '/admin/testimonials'
    },
    {
      label: 'Active Tokens',
      value: stats?.active_tokens || 0,
      subValue: `/ ${stats?.total_tokens || 0} total`,
      icon: Key,
      gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15), transparent)',
      iconColor: '#22c55e',
      link: '/admin/tokens'
    },
    {
      label: 'Average Rating',
      value: stats?.average_rating?.toFixed(1) || '5.0',
      icon: Star,
      gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), transparent)',
      iconColor: 'var(--accent-yellow)'
    }
  ];

  const quickActions = [
    {
      label: 'Add a new project',
      desc: 'Start by creating a new project to organize your client testimonials.',
      link: '/admin/projects',
      linkText: 'Get Started',
      icon: FolderKanban,
      gradient: 'linear-gradient(135deg, rgba(0,240,255,0.1), transparent)',
    },
    {
      label: 'Create invite links',
      desc: 'Generate unique invite links to send to your clients for testimonials.',
      link: '/admin/tokens',
      linkText: 'Generate Token',
      icon: Key,
      gradient: 'linear-gradient(135deg, rgba(34,197,94,0.1), transparent)',
    },
    {
      label: 'View all testimonials',
      desc: 'View, edit, and manage all client testimonials in one place.',
      link: '/admin/testimonials',
      linkText: 'View All',
      icon: MessageSquareQuote,
      gradient: 'linear-gradient(135deg, rgba(157,0,255,0.1), transparent)',
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
            Selamat datang!
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Berikut ringkasan statistik Anda.</p>
        </div>
        <Link to="/admin/projects" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {card.link ? (
              <Link to={card.link} className="block h-full">
                <StatCard card={card} />
              </Link>
            ) : (
              <StatCard card={card} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="rounded-2xl p-6 transition-all duration-300"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              background: action.gradient,
            }}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ 
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <action.icon className="w-6 h-6" style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {action.label}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              {action.desc}
            </p>
            <Link
              to={action.link}
              className="inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: 'var(--accent-cyan)' }}
            >
              {action.linkText} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Testimonials */}
      {stats?.recent_testimonials?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Testimonials
            </h2>
            <Link
              to="/admin/testimonials"
              className="text-sm flex items-center gap-1"
              style={{ color: 'var(--accent-cyan)' }}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recent_testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))'
                    }}
                  >
                    <span className="text-white font-bold">
                      {testimonial.client_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {testimonial.client_name}
                      </span>
                      <StarRating rating={testimonial.rating} size={14} readonly />
                    </div>
                    <p className="text-sm truncate" style={{ color: 'var(--text-tertiary)' }}>
                      {testimonial.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {format(new Date(testimonial.created_at), 'dd MMM yyyy')}
                    </p>
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

const StatCard = ({ card }) => (
  <div 
    className="h-full p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
    style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-primary)',
      background: card.gradient,
    }}
  >
    <div className="flex items-start justify-between mb-4">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ 
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-primary)'
        }}
      >
        <card.icon className="w-6 h-6" style={{ color: card.iconColor }} />
      </div>
      {card.link && <ArrowRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />}
    </div>
    <div 
      className="text-3xl font-display font-bold mb-1"
      style={{ color: card.iconColor }}
    >
      {card.value}
      {card.icon === Star && <Star className="inline w-5 h-5 ml-1 fill-current" />}
    </div>
    <p style={{ color: 'var(--text-muted)' }}>
      {card.label}
      {card.subValue && <span className="text-sm ml-1">{card.subValue}</span>}
    </p>
  </div>
);

export default DashboardPage;