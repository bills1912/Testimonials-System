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
  Send,
  FolderKanban
} from 'lucide-react';
import { format } from 'date-fns';
import { tokenAPI, adminAPI, parseErrorMessage } from '../../utils/api';
import Modal from '../../components/ui/Modal';
import CyberSelect from '../../components/ui/CyberSelect';
import LoadingScreen from '../../components/ui/LoadingScreen';
import Pagination from '../../components/ui/Pagination';

const ITEMS_PER_PAGE = 10;

const tokenStatusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'used', label: 'Used' },
  { value: 'expired', label: 'Expired' },
  { value: 'revoked', label: 'Revoked' }
];

const expiryOptions = [
  { value: 24, label: '24 Hours' },
  { value: 48, label: '48 Hours' },
  { value: 72, label: '72 Hours (3 Days)' },
  { value: 168, label: '1 Week' },
  { value: 336, label: '2 Weeks' },
  { value: 720, label: '1 Month' }
];

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
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Filter tokens based on status and search query
  const filteredTokens = tokens.filter((token) => {
    const matchesStatus = statusFilter === 'all' || token.status === statusFilter;
    const matchesSearch = 
      token.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (token.note && token.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTokens.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTokens = filteredTokens.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of tokens section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all';

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
      toast.error(parseErrorMessage(error, 'Gagal membuat token'));
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
      toast.error(parseErrorMessage(error, 'Gagal mencabut token'));
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
          <h1 className="font-display font-bold text-2xl lg:text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
            Invite Tokens
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="card-cyber p-4"
        >
          <p className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
            {stats.total}
          </p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Tokens</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-cyber p-4"
        >
          <p className="font-display font-bold text-2xl" style={{ color: '#059669' }}>
            {stats.active}
          </p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Active</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-cyber p-4"
        >
          <p className="font-display font-bold text-2xl" style={{ color: '#0891b2' }}>
            {stats.used}
          </p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Used</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-cyber p-4"
        >
          <p className="font-display font-bold text-2xl" style={{ color: '#64748b' }}>
            {stats.expired}
          </p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Expired</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="card-cyber p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="input-icon-left">
              <Search className="w-5 h-5 text-void-500" />
            </div>
            <input
              type="text"
              placeholder="Cari token atau proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-cyber input-with-icon-left"
            />
          </div>
          <CyberSelect
            options={tokenStatusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            icon={Filter}
            className="w-44"
          />
        </div>
      </div>

      {/* Pagination - Always visible */}
      <div className="mb-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredTokens.length}
          itemsPerPage={ITEMS_PER_PAGE}
          rightContent={
            hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-neon-cyan hover:text-neon-purple transition-colors"
              >
                Clear filters
              </button>
            )
          }
        />
      </div>

      {/* Tokens List */}
      {paginatedTokens.length > 0 ? (
        <div className="space-y-4">
          {paginatedTokens.map((token, index) => {
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
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {token.project_name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <code className="flex-1 font-mono text-sm px-3 py-2 rounded-lg truncate" style={{ backgroundColor: 'var(--bg-code)', color: 'var(--text-primary)' }}>
                        {token.invite_url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(token.invite_url, token.id)}
                        className="p-2 rounded-lg transition-all flex-shrink-0"
                        style={{
                          backgroundColor: copiedToken === token.id ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-tertiary)',
                          color: copiedToken === token.id ? 'var(--accent-green)' : 'var(--text-muted)'
                        }}
                      >
                        {copiedToken === token.id ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>
                        Created: {format(new Date(token.created_at), 'dd MMM yyyy HH:mm')}
                      </span>
                      <span>
                        Expires: {format(new Date(token.expires_at), 'dd MMM yyyy HH:mm')}
                      </span>
                      {token.used_at && (
                        <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                          Used: {format(new Date(token.used_at), 'dd MMM yyyy HH:mm')}
                        </span>
                      )}
                      {token.note && (
                        <span style={{ color: 'var(--text-tertiary)' }}>
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
                          className="p-2 rounded-lg transition-colors"
                          style={{
                            backgroundColor: 'rgba(5, 150, 105, 0.15)',
                            color: 'var(--accent-green)'
                          }}
                          title="Share via WhatsApp"
                        >
                          <Send className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedToken(token);
                            setShowRevokeModal(true);
                          }}
                          className="p-2 rounded-lg transition-colors"
                          style={{
                            backgroundColor: 'rgba(220, 38, 38, 0.15)',
                            color: 'var(--accent-red)'
                          }}
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
          <Key className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
            {hasActiveFilters
              ? 'Tidak ada token ditemukan'
              : 'Belum ada token'}
          </h3>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
            {hasActiveFilters
              ? 'Coba kata kunci atau filter lain'
              : projects.length > 0
                ? 'Generate token pertama untuk mengundang klien'
                : 'Buat proyek terlebih dahulu untuk generate token'}
          </p>
          {!hasActiveFilters && projects.length > 0 && (
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
            <CyberSelect
              options={[
                { value: '', label: '-- Pilih Proyek --' },
                ...projects.map(p => ({ value: p.id, label: `${p.name} (${p.client_name})` }))
              ]}
              value={formData.project_id}
              onChange={(value) => setFormData({ ...formData, project_id: value })}
              icon={FolderKanban}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Valid For
            </label>
            <CyberSelect
              options={expiryOptions}
              value={formData.expires_hours}
              onChange={(value) => setFormData({ ...formData, expires_hours: Number(value) })}
              icon={Clock}
            />
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