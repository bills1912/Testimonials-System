import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  AlertCircle,
  CheckCircle,
  Send,
  User,
  Briefcase,
  Building2,
  FileText,
  MessageSquare,
  Loader2,
  Shield,
  Sparkles,
  Home,
  ArrowLeft
} from 'lucide-react';
import { publicAPI } from '../../utils/api';
import StarRating from '../../components/ui/StarRating';
import LoadingScreen from '../../components/ui/LoadingScreen';

const WriteReviewPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [project, setProject] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    client_name: '',
    client_role: '',
    client_company: '',
    rating: 5,
    title: '',
    content: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        setMessage('Token tidak ditemukan. Silakan gunakan link undangan yang valid.');
        setValidating(false);
        return;
      }

      try {
        const response = await publicAPI.validateToken(token);
        if (response.data.valid) {
          setIsValid(true);
          setProject(response.data.project);
          setMessage(response.data.message);
        } else {
          setIsValid(false);
          setMessage(response.data.message);
        }
      } catch (error) {
        setIsValid(false);
        setMessage('Token tidak valid atau sudah kedaluwarsa.');
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.client_name.trim()) newErrors.client_name = 'Nama wajib diisi';
    if (!formData.title.trim()) newErrors.title = 'Judul wajib diisi';
    if (!formData.content.trim()) newErrors.content = 'Isi testimoni wajib diisi';
    if (formData.content.length < 20) newErrors.content = 'Testimoni minimal 20 karakter';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await publicAPI.submitTestimonial({
        token,
        ...formData
      });
      navigate('/review/success');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gagal mengirim testimoni');
    } finally {
      setSubmitting(false);
    }
  };

  if (validating) return <LoadingScreen />;

  // Invalid token state
  if (!isValid) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div 
            className="p-6 sm:p-8 rounded-2xl text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
            >
              <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Link Tidak Valid
            </h2>
            <p className="text-sm sm:text-base mb-6" style={{ color: 'var(--text-muted)' }}>
              {message}
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary w-full sm:w-auto"
            >
              Kembali ke Beranda
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Mobile Header */}
      <div 
        className="sticky top-0 z-50 px-4 py-3 backdrop-blur-xl sm:hidden"
        style={{ 
          backgroundColor: 'rgba(10,10,12,0.8)',
          borderBottom: '1px solid var(--border-primary)'
        }}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="p-2 -ml-2" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Tulis Testimoni
          </span>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="px-4 py-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4 sm:mb-6"
          >
            <span 
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm"
              style={{
                backgroundColor: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#22c55e',
              }}
            >
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Undangan Terverifikasi
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gradient mb-2 sm:mb-4">
              Testimoni Anda
            </h1>
            <p className="text-sm sm:text-base px-2" style={{ color: 'var(--text-muted)' }}>
              Terima kasih telah meluangkan waktu untuk berbagi pengalaman Anda.
            </p>
          </motion.div>

          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-4 sm:mb-8"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                }}
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm mb-0.5 sm:mb-1" style={{ color: 'var(--text-muted)' }}>Proyek</p>
                <h3 className="font-semibold text-base sm:text-lg truncate" style={{ color: 'var(--text-primary)' }}>
                  {project?.name}
                </h3>
                {project?.description && (
                  <p className="text-xs sm:text-sm mt-1 sm:mt-2 line-clamp-3" style={{ color: 'var(--text-tertiary)' }}>
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6"
          >
            {/* Rating */}
            <div 
              className="p-4 sm:p-6 rounded-xl sm:rounded-2xl"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <label className="block text-sm sm:text-base mb-2 sm:mb-3" style={{ color: 'var(--text-primary)' }}>
                Rating Anda <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3 sm:gap-4">
                <StarRating 
                  rating={formData.rating} 
                  onChange={handleRatingChange} 
                  size={28}
                  className="sm:scale-110"
                />
                <span className="font-bold text-base sm:text-lg" style={{ color: 'var(--text-primary)' }}>
                  {formData.rating}/5
                </span>
              </div>
            </div>

            {/* Personal Info */}
            <div 
              className="p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <InputField
                label="Nama Lengkap"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                error={errors.client_name}
                icon={User}
                required
                placeholder="Nama Anda"
              />
              <InputField
                label="Jabatan/Posisi"
                name="client_role"
                value={formData.client_role}
                onChange={handleChange}
                icon={Briefcase}
                placeholder="Contoh: Project Manager"
              />
              <InputField
                label="Perusahaan/Instansi"
                name="client_company"
                value={formData.client_company}
                onChange={handleChange}
                icon={Building2}
                placeholder="Nama perusahaan Anda"
              />
            </div>

            {/* Testimonial Content */}
            <div 
              className="p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <InputField
                label="Judul Testimoni"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                icon={FileText}
                required
                placeholder="Ringkasan singkat pengalaman Anda"
              />
              <div>
                <label className="flex items-center gap-2 text-sm sm:text-base mb-2" style={{ color: 'var(--text-primary)' }}>
                  <MessageSquare className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  Isi Testimoni <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Ceritakan pengalaman Anda bekerja sama dengan kami..."
                  className={`input-cyber resize-none text-sm sm:text-base ${errors.content ? 'input-error' : ''}`}
                />
                {errors.content && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.content}</p>
                )}
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {formData.content.length} / 5000 karakter
                </p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div 
              className="p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-start gap-2.5 sm:gap-3"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-cyan)' }} />
              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                Testimoni Anda akan ditampilkan secara publik dengan nama dan informasi yang Anda berikan.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 sm:py-3 text-sm sm:text-base"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  Kirim Testimoni
                </>
              )}
            </button>
          </motion.form>

          {/* Bottom spacing for mobile */}
          <div className="h-6 sm:h-0" />
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, error, icon: Icon, required, placeholder }) => (
  <div>
    <label className="flex items-center gap-2 text-sm sm:text-base mb-1.5 sm:mb-2" style={{ color: 'var(--text-primary)' }}>
      {Icon && <Icon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input-cyber text-sm sm:text-base py-2.5 sm:py-3 ${error ? 'input-error' : ''}`}
    />
    {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
  </div>
);

export default WriteReviewPage;