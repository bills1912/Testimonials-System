import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MessageSquareQuote,
  Search,
  Filter,
  Star,
  Eye,
  EyeOff,
  Trash2,
  MoreVertical,
  Calendar,
  User,
  Building2,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { adminAPI } from '../../utils/api';
import Modal from '../../components/ui/Modal';
import StarRating from '../../components/ui/StarRating';
import LoadingScreen from '../../components/ui/LoadingScreen';

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const response = await adminAPI.getTestimonials();
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Gagal memuat testimoni');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch = 
      t.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 0 || t.rating >= ratingFilter;
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'featured' && t.is_featured) ||
      (statusFilter === 'published' && t.is_published) ||
      (statusFilter === 'unpublished' && !t.is_published);
    return matchesSearch && matchesRating && matchesStatus;
  });

  const toggleFeatured = async (id) => {
    try {
      const response = await adminAPI.toggleFeatured(id);
      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, is_featured: response.data.is_featured } : t
      ));
      toast.success(response.data.is_featured ? 'Marked as featured' : 'Removed from featured');
    } catch (error) {
      toast.error('Gagal mengubah status featured');
    }
  };

  const togglePublished = async (id) => {
    try {
      const response = await adminAPI.togglePublished(id);
      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, is_published: response.data.is_published } : t
      ));
      toast.success(response.data.is_published ? 'Published' : 'Unpublished');
    } catch (error) {
      toast.error('Gagal mengubah status publish');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteTestimonial(selectedTestimonial.id);
      setTestimonials(testimonials.filter(t => t.id !== selectedTestimonial.id));
      toast.success('Testimoni berhasil dihapus');
      setShowDeleteModal(false);
      setSelectedTestimonial(null);
    } catch (error) {
      toast.error('Gagal menghapus testimoni');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingScreen />;

  const stats = {
    total: testimonials.length,
    featured: testimonials.filter(t => t.is_featured).length,
    avgRating: testimonials.length > 0 
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : '0.0'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl text-white mb-2">
          Testimonials
        </h1>
        <p className="text-void-400">
          Kelola semua testimoni dari klien Anda.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-cyber p-4"
        >
          <p className="font-display font-bold text-2xl text-white">{stats.total}</p>
          <p className="text-sm text-void-500">Total Reviews</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-cyber p-4"
        >
          <p className="font-display font-bold text-2xl text-neon-yellow">{stats.featured}</p>
          <p className="text-sm text-void-500">Featured</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-cyber p-4"
        >
          <div className="flex items-center gap-2">
            <p className="font-display font-bold text-2xl text-neon-cyan">{stats.avgRating}</p>
            <Star className="w-5 h-5 text-neon-yellow fill-neon-yellow" />
          </div>
          <p className="text-sm text-void-500">Avg Rating</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="card-cyber p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-void-500" />
            <input
              type="text"
              placeholder="Cari testimoni..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-cyber pl-12"
            />
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-void-500" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="input-cyber w-36"
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={3}>3+ Stars</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-void-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-cyber w-36"
            >
              <option value="all">All Status</option>
              <option value="featured">Featured</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      {filteredTestimonials.length > 0 ? (
        <div className="space-y-4">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-cyber p-6"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Avatar & Author Info */}
                <div className="flex items-start gap-4 lg:w-64 flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-neon-cyan">
                      {testimonial.client_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white truncate">
                      {testimonial.client_name}
                    </h4>
                    {testimonial.client_role && (
                      <p className="text-sm text-void-500 truncate">
                        {testimonial.client_role}
                      </p>
                    )}
                    {testimonial.client_company && (
                      <p className="text-sm text-void-500 truncate flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {testimonial.client_company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <StarRating rating={testimonial.rating} size="sm" />
                      <span className="px-2 py-1 text-xs bg-void-800/50 text-void-400 rounded">
                        {testimonial.project_name}
                      </span>
                      {testimonial.is_featured && (
                        <span className="px-2 py-1 text-xs bg-neon-yellow/10 text-neon-yellow rounded">
                          Featured
                        </span>
                      )}
                      {!testimonial.is_published && (
                        <span className="px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded">
                          Unpublished
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h5 className="font-medium text-white mb-2">"{testimonial.title}"</h5>
                  <p className="text-void-400 text-sm line-clamp-2 mb-3">
                    {testimonial.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-void-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(testimonial.created_at), 'dd MMM yyyy')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setSelectedTestimonial(testimonial);
                      setShowViewModal(true);
                    }}
                    className="p-2 rounded-lg bg-void-800/50 text-void-400 hover:text-white hover:bg-void-700/50 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleFeatured(testimonial.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      testimonial.is_featured
                        ? 'bg-neon-yellow/10 text-neon-yellow'
                        : 'bg-void-800/50 text-void-400 hover:text-neon-yellow hover:bg-void-700/50'
                    }`}
                    title={testimonial.is_featured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <Star className={`w-5 h-5 ${testimonial.is_featured ? 'fill-neon-yellow' : ''}`} />
                  </button>
                  <button
                    onClick={() => togglePublished(testimonial.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      testimonial.is_published
                        ? 'bg-neon-green/10 text-neon-green'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                    title={testimonial.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {testimonial.is_published ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTestimonial(testimonial);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 rounded-lg bg-void-800/50 text-void-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card-cyber p-12 text-center">
          <MessageSquareQuote className="w-12 h-12 text-void-600 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-white mb-2">
            {searchQuery || ratingFilter > 0 || statusFilter !== 'all'
              ? 'Tidak ada testimoni ditemukan'
              : 'Belum ada testimoni'}
          </h3>
          <p className="text-void-400">
            {searchQuery || ratingFilter > 0 || statusFilter !== 'all'
              ? 'Coba kata kunci atau filter lain'
              : 'Generate token undangan dan kirim ke klien untuk mengumpulkan testimoni'}
          </p>
        </div>
      )}

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTestimonial(null);
        }}
        title="Testimonial Details"
        size="lg"
      >
        {selectedTestimonial && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                <span className="font-display font-bold text-xl text-neon-cyan">
                  {selectedTestimonial.client_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-xl text-white">
                  {selectedTestimonial.client_name}
                </h4>
                <p className="text-void-400">
                  {selectedTestimonial.client_role}
                  {selectedTestimonial.client_role && selectedTestimonial.client_company && ' @ '}
                  {selectedTestimonial.client_company}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <StarRating rating={selectedTestimonial.rating} size="lg" showLabel />
              <span className="px-3 py-1 text-sm bg-void-800/50 text-void-400 rounded">
                {selectedTestimonial.project_name}
              </span>
            </div>

            <div>
              <h5 className="font-display font-bold text-lg text-white mb-2">
                "{selectedTestimonial.title}"
              </h5>
              <p className="text-void-300 leading-relaxed whitespace-pre-wrap">
                {selectedTestimonial.content}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-void-700/50 text-sm text-void-500">
              <span>Created: {format(new Date(selectedTestimonial.created_at), 'dd MMMM yyyy HH:mm')}</span>
              {selectedTestimonial.is_featured && (
                <span className="text-neon-yellow">⭐ Featured</span>
              )}
              <span className={selectedTestimonial.is_published ? 'text-neon-green' : 'text-red-400'}>
                {selectedTestimonial.is_published ? '✓ Published' : '✗ Unpublished'}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTestimonial(null);
        }}
        title="Delete Testimonial"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-void-300 mb-2">
            Apakah Anda yakin ingin menghapus testimoni dari
          </p>
          <p className="font-semibold text-white mb-4">
            "{selectedTestimonial?.client_name}"?
          </p>
          <p className="text-sm text-void-500 mb-6">
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedTestimonial(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-danger flex items-center gap-2"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TestimonialsPage;
