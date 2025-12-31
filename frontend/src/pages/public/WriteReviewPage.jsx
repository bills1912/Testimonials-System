import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Key,
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
  Sparkles
} from 'lucide-react';
import { publicAPI } from '../../utils/api';
import StarRating from '../../components/ui/StarRating';
import LoadingScreen from '../../components/ui/LoadingScreen';
import useThemeStore from '../../context/themeStore';

const WriteReviewPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { theme, applyTheme } = useThemeStore();

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

  // Force light mode for review page
  useEffect(() => {
    applyTheme('light');
    return () => {
      applyTheme(theme);
    };
  }, []);

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
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <div 
            className="p-8 rounded-2xl text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
            >
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Link Tidak Valid
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
              {message}
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Kembali ke Beranda
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{
              backgroundColor: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)',
              color: '#22c55e',
            }}
          >
            <CheckCircle className="w-4 h-4" />
            Undangan Terverifikasi
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gradient mb-4">
            Testimoni Anda
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Terima kasih telah meluangkan waktu untuk berbagi pengalaman Anda. 
            Testimoni Anda sangat berarti bagi kami.
          </p>
        </motion.div>

        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl mb-8"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ 
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Proyek</p>
              <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                {project?.name}
              </h3>
              {project?.description && (
                <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
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
          className="space-y-6"
        >
          {/* Rating */}
          <div 
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <label className="block mb-3" style={{ color: 'var(--text-primary)' }}>
              Rating Anda <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <StarRating 
                rating={formData.rating} 
                onChange={handleRatingChange} 
                size={32}
              />
              <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                {formData.rating}/5
              </span>
            </div>
          </div>

          {/* Personal Info */}
          <div 
            className="p-6 rounded-2xl space-y-4"
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
            className="p-6 rounded-2xl space-y-4"
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
              <label className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}>
                <MessageSquare className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                Isi Testimoni <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={5}
                placeholder="Ceritakan pengalaman Anda bekerja sama dengan kami..."
                className={`input-cyber resize-none ${errors.content ? 'input-error' : ''}`}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {formData.content.length} / 5000 karakter
              </p>
            </div>
          </div>

          {/* Privacy Notice */}
          <div 
            className="p-4 rounded-xl flex items-start gap-3"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-cyan)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Testimoni Anda akan ditampilkan secara publik dengan nama dan informasi yang Anda berikan. 
              Pastikan Anda tidak menyertakan informasi sensitif atau pribadi.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Kirim Testimoni
              </>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, error, icon: Icon, required, placeholder }) => (
  <div>
    <label className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}>
      {Icon && <Icon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input-cyber ${error ? 'input-error' : ''}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default WriteReviewPage;