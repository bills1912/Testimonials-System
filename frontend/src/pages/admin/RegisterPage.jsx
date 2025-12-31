import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import useAuthStore from '../../context/authStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nama lengkap wajib diisi';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak sama';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Mohon perbaiki error pada form');
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      toast.success('Registrasi berhasil!');
      navigate('/admin/dashboard');
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const strengthLabels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];

  return (
    <div className="min-h-screen bg-void-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] orb orb-purple"
        animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] orb orb-cyan"
        animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-void-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="card-cyber p-8">
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30 mb-4"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-8 h-8 text-neon-purple" />
            </motion.div>
            <h1 className="font-display font-bold text-2xl text-white mb-2">
              Buat Akun Admin
            </h1>
            <p className="text-void-400 text-sm">
              Daftar untuk mulai mengelola testimoni
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">Nama Lengkap</label>
              <div className="relative">
                <div className="input-icon-left">
                  <User className="w-5 h-5 text-void-500" />
                </div>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`input-cyber input-with-icon-left ${errors.full_name ? 'input-error' : ''}`}
                />
              </div>
              {errors.full_name && <p className="mt-1 text-sm text-red-400">{errors.full_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">Username</label>
              <div className="relative">
                <div className="input-icon-left">
                  <User className="w-5 h-5 text-void-500" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={`input-cyber input-with-icon-left ${errors.username ? 'input-error' : ''}`}
                  autoComplete="username"
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">Email</label>
              <div className="relative">
                <div className="input-icon-left">
                  <Mail className="w-5 h-5 text-void-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`input-cyber input-with-icon-left ${errors.email ? 'input-error' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">Password</label>
              <div className="relative">
                <div className="input-icon-left">
                  <Lock className="w-5 h-5 text-void-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-cyber input-with-icon-left input-with-icon-right ${errors.password ? 'input-error' : ''}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-icon-right text-void-500 hover:text-void-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passwordStrength() ? strengthColors[passwordStrength() - 1] : 'bg-void-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-void-500">
                    Kekuatan: {strengthLabels[passwordStrength() - 1] || 'Sangat Lemah'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">Konfirmasi Password</label>
              <div className="relative">
                <div className="input-icon-left">
                  <Lock className="w-5 h-5 text-void-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-cyber input-with-icon-left ${errors.confirmPassword ? 'input-error' : ''}`}
                  autoComplete="new-password"
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="input-icon-right">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Daftar
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-void-700 to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-void-900 text-void-500 text-sm">atau</span>
            </div>
          </div>

          <p className="text-center text-void-400">
            Sudah punya akun?{' '}
            <Link
              to="/admin/login"
              className="text-neon-cyan hover:text-neon-purple transition-colors font-medium"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
