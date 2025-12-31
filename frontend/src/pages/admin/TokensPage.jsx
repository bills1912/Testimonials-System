import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Key,
  Plus,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
  Loader2,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { tokenAPI, adminAPI } from '../../utils/api';
import Modal from '../../components/ui/Modal';
import LoadingScreen from '../../components/ui/LoadingScreen';

const TokensPage = () => {
  const [tokens, setTokens] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    project_id: '',
    expires_hours: 72,
    note: ''
  });

  const fetchData = async () => {
    try {
      const [tokensRes, projectsRes] = await Promise.all([
        tokenAPI.getAll(),
        adminAPI.getProjects()
      ]);
      setTokens(tokensRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTokens = tokens.filter((token) => {
    const matchesStatus = statusFilter === 'all' || token.status === statusFilter;
    const matchesSearch = 
      token.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (token.note && token.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.project_id) {
      toast.error('Pilih proyek terlebih dahulu');
      return;
    }
    
    setGenerating(true);
    try {
      const response = await tokenAPI.generate(formData);
      setTokens([response.data, ...tokens]);
      toast.success('Token berhasil dibuat!');
      setShowCreateModal(false);
      setFormData({ project_id: '', expires_hours: 72, note: '' });
      
      await navigator.clipboard.writeText(response.data.invite_url);
      toast.success('Link sudah disalin ke clipboard!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gagal membuat token');
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async () => {
    try {
      await tokenAPI.revoke(selectedToken.id);
      setTokens(tokens.map(t => 
        t.id === selectedToken.id ? { ...t, status: 'revoked' } : t
      ));
      toast.success('Token berhasil dicabut');
      setShowRevokeModal(false);
      setSelectedToken(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gagal mencabut token');
    }
  };

  const copyToClipboard = async (text, tokenId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToken(tokenId);
      toast.success('Link berhasil disalin!');
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      toast.error('Gagal menyalin link');
    }
  };

  if (loading) return <LoadingScreen />;

  const statusConfig = {
    active: {
      icon: Clock,
      color: 'bg-neon-green/10 text-neon-green border-neon-green/30',
      label: 'Active'
    },
    used: {
      icon: CheckCircle,
      color: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
      label: 'Used'
    },
    expired: {
      icon: AlertCircle,
      color: 'bg-void-600/10 text-void-400 border-void-600/30',
      label: 'Expired'
    },
    revoked: {
      icon: XCircle,
      color: 'bg-red-500/10 text-red-400 border-red-500/30',
      label: 'Revoked'
    }
  };

  const stats = {
    total: tokens.length,
    active: tokens.filter(t => t.status === 'active').length,
    used: tokens.filter(t => t.status === 'used').length,
    expired: tokens.filter(t => t.status === 'expired').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-white mb-2">
            Invite Tokens
          </h1>
          <p className="text-void-400">
            Kelola token undangan untuk klien Anda.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary inline-flex items-center gap-2"
          disabled={projects.length === 0}
        >
          <Plus className="w-4 h-4" />
          Generate Token
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tokens', value: stats.total, color: 'text-white' },
          { label: 'Active', value: stats.active, color: 'text-neon-green' },
          { label: 'Used', value: stats.used, color: 'text-neon-cyan' },
          { label: 'Expired', value: stats.expired, color: 'text-void-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-cyber p-4"
          >
            <p className={`font-display font-bold text-2xl ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-sm text-void-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-cyber p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-void-500" />
            <input
              type="text"
              placeholder="Cari token atau proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-cyber pl-12"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-void-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-cyber w-40"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="used">Used</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tokens List */}
      {filteredTokens.length > 0 ? (
        <div className="space-y-4">
          {filteredTokens.map((token, index) => {
            const status = statusConfig[token.status];
            const StatusIcon = status.icon;
            
            return (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-cyber p-4 lg:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Token Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded border ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {token.project_name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <code className="flex-1 font-mono text-sm text-void-300 bg-void-800/50 px-3 py-2 rounded-lg truncate">
                        {token.invite_url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(token.invite_url, token.id)}
                        className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                          copiedToken === token.id
                            ? 'bg-neon-green/10 text-neon-green'
                            : 'bg-void-700/50 text-void-400 hover:text-white hover:bg-void-600/50'
                        }`}
                      >
                        {copiedToken === token.id ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-void-500">
                      <span>
                        Created: {format(new Date(token.created_at), 'dd MMM yyyy HH:mm')}
                      </span>
                      <span>
                        Expires: {format(new Date(token.expires_at), 'dd MMM yyyy HH:mm')}
                      </span>
                      {token.used_at && (
                        <span className="text-neon-cyan">
                          Used: {format(new Date(token.used_at), 'dd MMM yyyy HH:mm')}
                        </span>
                      )}
                      {token.note && (
                        <span className="text-void-400">
                          Note: {token.note}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {token.status === 'active' && (
                      <>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Silakan berikan testimoni Anda melalui link berikut: ${token.invite_url}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-colors"
                          title="Share via WhatsApp"
                        >
                          <Send className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedToken(token);
                            setShowRevokeModal(true);
                          }}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Revoke Token"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card-cyber p-12 text-center">
          <Key className="w-12 h-12 text-void-600 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-white mb-2">
            {searchQuery || statusFilter !== 'all'
              ? 'Tidak ada token ditemukan'
              : 'Belum ada token'}
          </h3>
          <p className="text-void-400 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Coba kata kunci atau filter lain'
              : projects.length > 0
                ? 'Generate token pertama untuk mengundang klien'
                : 'Buat proyek terlebih dahulu untuk generate token'}
          </p>
          {!searchQuery && statusFilter === 'all' && projects.length > 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Generate Token
            </button>
          )}
        </div>
      )}

      {/* Create Token Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Generate Invite Token"
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Select Project *
            </label>
            <select
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="input-cyber"
              required
            >
              <option value="">-- Pilih Proyek --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.client_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Valid For
            </label>
            <select
              value={formData.expires_hours}
              onChange={(e) => setFormData({ ...formData, expires_hours: Number(e.target.value) })}
              className="input-cyber"
            >
              <option value={24}>24 Hours</option>
              <option value={48}>48 Hours</option>
              <option value={72}>72 Hours (3 Days)</option>
              <option value={168}>1 Week</option>
              <option value={336}>2 Weeks</option>
              <option value={720}>1 Month</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Note (Optional)
            </label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="e.g., Sent via WhatsApp to client"
              className="input-cyber"
            />
          </div>

          <div className="p-4 rounded-lg bg-void-800/50 border border-void-700/50">
            <p className="text-sm text-void-400">
              <strong className="text-white">Catatan:</strong> Token ini hanya bisa digunakan sekali. 
              Setelah klien mengirim testimoni, token akan otomatis hangus.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generating}
              className="btn-primary flex items-center gap-2"
            >
              {generating && <Loader2 className="w-4 h-4 animate-spin" />}
              Generate & Copy
            </button>
          </div>
        </form>
      </Modal>

      {/* Revoke Confirmation Modal */}
      <Modal
        isOpen={showRevokeModal}
        onClose={() => {
          setShowRevokeModal(false);
          setSelectedToken(null);
        }}
        title="Revoke Token"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-void-300 mb-2">
            Apakah Anda yakin ingin mencabut token ini?
          </p>
          <p className="text-sm text-void-500 mb-6">
            Token yang sudah dicabut tidak bisa digunakan lagi oleh klien.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setShowRevokeModal(false);
                setSelectedToken(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleRevoke}
              className="btn-danger"
            >
              Revoke Token
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TokensPage;
