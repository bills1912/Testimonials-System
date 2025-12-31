import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MessageSquare, SlidersHorizontal } from 'lucide-react';
import { publicAPI } from '../../utils/api';
import TestimonialCard from '../../components/ui/TestimonialCard';
import CyberSelect from '../../components/ui/CyberSelect';
import LoadingScreen from '../../components/ui/LoadingScreen';

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 5, label: '5 Stars Only' },
    { value: 4, label: '4+ Stars' },
    { value: 3, label: '3+ Stars' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'lowest', label: 'Lowest Rated' }
  ];

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await publicAPI.getTestimonials();
        setTestimonials(response.data);
        setFilteredTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    let filtered = [...testimonials];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.client_name.toLowerCase().includes(query) ||
          t.title.toLowerCase().includes(query) ||
          t.content.toLowerCase().includes(query) ||
          t.project_name.toLowerCase().includes(query)
      );
    }

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter((t) => t.rating >= ratingFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }

    setFilteredTestimonials(filtered);
  }, [testimonials, searchQuery, ratingFilter, sortBy]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/20 mb-6"
          >
            <MessageSquare className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-medium text-neon-purple">
              {testimonials.length} Reviews
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl lg:text-5xl text-white mb-4"
          >
            Client <span className="text-gradient">Testimonials</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-void-400 max-w-2xl mx-auto"
          >
            Read what our clients have to say about their experience working with us.
            Every review is authentic and verified through our invite-only system.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-cyber p-4 mb-8 relative"
          style={{ zIndex: 100 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="input-icon-left">
                <Search className="w-5 h-5 text-void-500" />
              </div>
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-cyber input-with-icon-left"
              />
            </div>

            {/* Rating filter - Custom Select */}
            <CyberSelect
              options={ratingOptions}
              value={ratingFilter}
              onChange={setRatingFilter}
              icon={Star}
              className="w-full lg:w-48"
            />

            {/* Sort - Custom Select */}
            <CyberSelect
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              icon={SlidersHorizontal}
              className="w-full lg:w-48"
            />
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-void-400">
            Showing <span className="text-white font-medium">{filteredTestimonials.length}</span> testimonials
          </p>
          {(searchQuery || ratingFilter > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setRatingFilter(0);
              }}
              className="text-sm text-neon-cyan hover:text-neon-purple transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Testimonials grid */}
        {filteredTestimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                featured={testimonial.is_featured}
                delay={index * 0.05}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-cyber p-12 text-center"
          >
            <MessageSquare className="w-12 h-12 text-void-600 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No testimonials found
            </h3>
            <p className="text-void-400">
              {searchQuery || ratingFilter > 0
                ? 'Try adjusting your search or filters'
                : 'Be the first to leave a testimonial!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;
