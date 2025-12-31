import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Star,
  MessageSquare,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Trash2,
  Award,
  MoreVertical,
  User,
  Calendar,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { adminAPI, parseErrorMessage } from '../../utils/api';
import Modal from '../../components/ui/Modal';
import CyberSelect from '../../components/ui/CyberSelect';
import StarRating from '../../components/ui/StarRating';
import LoadingScreen from '../../components/ui/LoadingScreen';
import Pagination from '../../components/ui/Pagination';

const ITEMS_PER_PAGE = 10;

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

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
  { value: 'featured', label: 'Featured' }
];

const AdminTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const response = await adminAPI.getTestimonials();
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Gagal memuat data testimoni');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Filter and sort testimonials
  const filteredTestimonials = testimonials.filter((t) => {
    // Search filter
    const matchesSearch = !searchQuery || 
      t.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Rating filter
    const matchesRating = ratingFilter === 0 || t.rating >= ratingFilter;
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'published') matchesStatus = t.is_published;
    else if (statusFilter === 'unpublished') matchesStatus = !t.is_published;
    else if (statusFilter === 'featured') matchesStatus = t.is_featured;
    
    return matchesSearch && matchesRating && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter, statusFilter, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFeatured = async (testimonial) => {
    setProcessing(true);
    try {
      await adminAPI.toggleFeatured(testimonial.id);
      setTestimonials(testimonials.map(t => 
        t.id === testimonial.id ? { ...t, is_featured: !t.is_featured } : t
      ));
      toast.success(testimonial.is_featured ? 'Featured dihapus' : 'Ditandai sebagai featured');
    } catch (error) {
      toast.error(parseErrorMessage(error, 'Gagal mengubah status featured'));
    } finally {
      setProcessing(false);
    }
  };

  const handleTogglePublished = async (testimonial) => {
    setProcessing(true);
    try {
      await adminAPI.togglePublished(testimonial.id);
      setTestimonials(testimonials.map(t => 
        t.id === testimonial.id ? { ...t, is_published: !t.is_published } : t
      ));
      toast.success(testimonial.is_published ? 'Testimoni disembunyikan' : 'Testimoni dipublikasikan');
    } catch (error) {
      toast.error(parseErrorMessage(error, 'Gagal mengubah status publikasi'));
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTestimonial) return;
    
    setProcessing(true);
    try {
      await adminAPI.deleteTestimonial(selectedTestimonial.id);
      setTestimonials(testimonials.filter(t => t.id !== selectedTestimonial.id));
      toast.success('Testimoni berhasil dihapus');
      setShowDeleteModal(false);
      setSelectedTestimonial(null);
      // Reset to previous page if current page becomes empty
      if (paginatedTestimonials.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error(parseErrorMessage(error, 'Gagal menghapus testimoni'));
    } finally {
      setProcessing(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRatingFilter(0);
    setStatusFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || ratingFilter > 0 || statusFilter !== 'all';

  if (loading) return <LoadingScreen />;

  // Stats
  const stats = {
    total: testimonials.length,
    published: testimonials.filter(t => t.is_published).length,
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
          Kelola semua testimoni klien Anda di sini.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Testimoni', value: stats.total, color: 'text-white' },
          { label: 'Published', value: stats.published, color: 'text-neon-green' },
          { label: 'Featured', value: stats.featured, color: 'text-neon-cyan' },
          { label: 'Avg. Rating', value: stats.avgRating, color: 'text-neon-yellow', icon: Star }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-cyber p-4"
          >
            <div className="flex items-center gap-2">
              <p className={`font-display font-bold text-2xl ${stat.color}`}>
                {stat.value}
              </p>
              {stat.icon && <stat.icon className="w-5 h-5 fill-neon-yellow text-neon-yellow" />}
            </div>
            <p className="text-sm text-void-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-cyber p-4" style={{ zIndex: 100, position: 'relative' }}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="input-icon-left">
              <Search className="w-5 h-5 text-void-500" />
            </div>
            <input
              type="text"
              placeholder="Cari testimoni..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-cyber input-with-icon-left"
            />
          </div>

          {/* Rating filter */}
          <CyberSelect
            options={ratingOptions}
            value={ratingFilter}
            onChange={setRatingFilter}
            icon={Star}
            className="w-full lg:w-40"
          />

          {/* Status filter */}
          <CyberSelect
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            icon={Filter}
            className="w-full lg:w-44"
          />

          {/* Sort */}
          <CyberSelect
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            icon={SlidersHorizontal}
            className="w-full lg:w-44"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-void-400">
          Menampilkan <span className="text-white font-medium">{filteredTestimonials.length}</span> testimoni
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-neon-cyan hover:text-neon-purple transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Pagination - Always visible */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredTestimonials.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {/* Testimonials List */}
      {paginatedTestimonials.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`card-cyber p-4 lg:p-6 ${!testimonial.is_published ? 'opacity-60' : ''}`}
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {/* Badges */}
                      {testimonial.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30">
                          <Award className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                      {!testimonial.is_published && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border bg-void-600/10 text-void-400 border-void-600/30">
                          <EyeOff className="w-3 h-3" />
                          Hidden
                        </span>
                      )}
                      <StarRating rating={testimonial.rating} size="sm" readonly />
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-lg text-white mb-2 line-clamp-1">
                      "{testimonial.title}"
                    </h3>

                    {/* Content */}
                    <p className="text-void-300 text-sm mb-4 line-clamp-2">
                      {testimonial.content}
                    </p>

                    {/* Author & Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-void-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {testimonial.client_name}
                        {testimonial.client_company && ` @ ${testimonial.client_company}`}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-void-800/50 border border-void-700/50">
                        {testimonial.project_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(testimonial.created_at), 'dd MMM yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col items-center gap-2 lg:border-l lg:border-void-700/50 lg:pl-4">
                    <button
                      onClick={() => handleTogglePublished(testimonial)}
                      disabled={processing}
                      className={`p-2 rounded-lg transition-all ${
                        testimonial.is_published
                          ? 'bg-neon-green/10 text-neon-green hover:bg-neon-green/20'
                          : 'bg-void-700/50 text-void-400 hover:text-white hover:bg-void-600/50'
                      }`}
                      title={testimonial.is_published ? 'Hide' : 'Publish'}
                    >
                      {testimonial.is_published ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleFeatured(testimonial)}
                      disabled={processing}
                      className={`p-2 rounded-lg transition-all ${
                        testimonial.is_featured
                          ? 'bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20'
                          : 'bg-void-700/50 text-void-400 hover:text-white hover:bg-void-600/50'
                      }`}
                      title={testimonial.is_featured ? 'Remove Featured' : 'Set Featured'}
                    >
                      <Award className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTestimonial(testimonial);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-cyber p-12 text-center"
        >
          <MessageSquare className="w-12 h-12 text-void-600 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-white mb-2">
            Tidak ada testimoni ditemukan
          </h3>
          <p className="text-void-400">
            {hasActiveFilters
              ? 'Coba ubah filter atau kata kunci pencarian'
              : 'Belum ada testimoni dari klien'}
          </p>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTestimonial(null);
        }}
        title="Hapus Testimoni"
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
              disabled={processing}
              className="btn-danger flex items-center gap-2"
            >
              {processing && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTestimonialsPage;