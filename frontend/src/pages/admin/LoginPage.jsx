import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User,
  Lock,
  LogIn,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import useAuthStore from '../../context/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Mohon isi semua field');
      return;
    }

    const result = await login(formData);
    if (result.success) {
      toast.success('Login berhasil!');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-void-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] orb orb-cyan"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] orb orb-purple"
        animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      {/* Back to home */}
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
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 mb-4"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-8 h-8 text-neon-cyan" />
            </motion.div>
            <h1 className="font-display font-bold text-2xl text-white mb-2">
              Admin Login
            </h1>
            <p className="text-void-400 text-sm">
              Masuk untuk mengelola testimoni
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="input-icon-left">
                  <User className="w-5 h-5 text-void-500" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="input-cyber input-with-icon-left"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="input-icon-left">
                  <Lock className="w-5 h-5 text-void-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="input-cyber input-with-icon-left input-with-icon-right"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-icon-right text-void-500 hover:text-void-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Masuk
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-void-700 to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-void-900 text-void-500 text-sm">atau</span>
            </div>
          </div>

          {/* Register link */}
          <p className="text-center text-void-400">
            Belum punya akun?{' '}
            <Link
              to="/admin/register"
              className="text-neon-cyan hover:text-neon-purple transition-colors font-medium"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
