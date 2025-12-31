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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.client_name.trim()) {
      newErrors.client_name = 'Nama wajib diisi';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Judul testimoni wajib diisi';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Judul minimal 5 karakter';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Isi testimoni wajib diisi';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Testimoni minimal 20 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      await publicAPI.submitTestimonial({
        token,
        ...formData
      });
      
      toast.success('Testimoni berhasil dikirim!');
      navigate('/review/success');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Gagal mengirim testimoni';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (validating) return <LoadingScreen />;

  if (!isValid) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <div className="card-cyber p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-4">
              Link Tidak Valid
            </h2>
            <p className="text-void-400 mb-6">{message}</p>
            <div className="p-4 rounded-lg bg-void-800/50 border border-void-700/50">
              <p className="text-sm text-void-400">
                Jika Anda yakin link ini valid, silakan hubungi pemilik proyek untuk mendapatkan link undangan baru.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/20 mb-6">
            <CheckCircle className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-medium text-neon-green">
              Undangan Terverifikasi
            </span>
          </div>
          
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-white mb-4">
            Tulis <span className="text-gradient">Testimoni Anda</span>
          </h1>
          
          <p className="text-void-400 max-w-xl mx-auto">
            Terima kasih telah meluangkan waktu untuk berbagi pengalaman Anda.
            Testimoni Anda sangat berarti bagi kami.
          </p>
        </motion.div>

        {/* Project info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-cyber p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-neon-cyan" />
            </div>
            <div>
              <p className="text-sm text-void-500 mb-1">Proyek</p>
              <h3 className="font-display font-bold text-xl text-white">
                {project?.name}
              </h3>
              {project?.description && (
                <p className="text-void-400 mt-2">{project.description}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="card-cyber p-6 lg:p-8"
        >
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-void-300 mb-3">
                Rating Anda *
              </label>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={formData.rating}
                  onChange={handleRatingChange}
                  readonly={false}
                  size="xl"
                />
                <span className="font-mono text-lg text-void-400">
                  {formData.rating}/5
                </span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nama Anda *
              </label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap Anda"
                className={`input-cyber ${errors.client_name ? 'input-error' : ''}`}
              />
              {errors.client_name && (
                <p className="mt-1 text-sm text-red-400">{errors.client_name}</p>
              )}
            </div>

            {/* Role & Company */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-void-300 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Jabatan (Opsional)
                </label>
                <input
                  type="text"
                  name="client_role"
                  value={formData.client_role}
                  onChange={handleChange}
                  placeholder="Contoh: CEO, Manager, Developer"
                  className="input-cyber"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-void-300 mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Perusahaan (Opsional)
                </label>
                <input
                  type="text"
                  name="client_company"
                  value={formData.client_company}
                  onChange={handleChange}
                  placeholder="Nama perusahaan Anda"
                  className="input-cyber"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Judul Testimoni *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ringkasan singkat pengalaman Anda"
                className={`input-cyber ${errors.title ? 'input-error' : ''}`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Isi Testimoni *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Ceritakan pengalaman Anda bekerja sama dengan kami..."
                rows={6}
                className={`input-cyber resize-none ${errors.content ? 'input-error' : ''}`}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.content && (
                  <p className="text-sm text-red-400">{errors.content}</p>
                )}
                <p className="text-xs text-void-500 ml-auto">
                  {formData.content.length} / 5000 karakter
                </p>
              </div>
            </div>

            {/* Privacy note */}
            <div className="p-4 rounded-lg bg-void-800/50 border border-void-700/50">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                <p className="text-sm text-void-400">
                  Testimoni Anda akan ditampilkan secara publik dengan nama dan informasi yang Anda berikan. 
                  Pastikan Anda tidak menyertakan informasi sensitif atau pribadi.
                </p>
              </div>
            </div>

            {/* Submit button */}
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
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default WriteReviewPage;
