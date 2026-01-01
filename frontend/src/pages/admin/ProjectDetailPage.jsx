import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  FolderKanban,
  MessageSquare,
  Key,
  ExternalLink,
  Calendar,
  User,
  Mail,
  Building2,
  Tag,
  Plus,
  Copy,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { adminAPI, tokenAPI } from '../../utils/api';
import Modal from '../../components/ui/Modal';
import StarRating from '../../components/ui/StarRating';
import LoadingScreen from '../../components/ui/LoadingScreen';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  
  const [tokenForm, setTokenForm] = useState({
    expires_hours: 72,
    note: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, tokensRes, testimonialsRes] = await Promise.all([
          adminAPI.getProject(id),
          tokenAPI.getByProject(id),
          adminAPI.getTestimonials({ project_id: id })
        ]);
        setProject(projectRes.data);
        setTokens(tokensRes.data);
        setTestimonials(testimonialsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Gagal memuat data proyek');
        navigate('/admin/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const generateToken = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const response = await tokenAPI.generate({
        project_id: id,
        ...tokenForm
      });
      setTokens([response.data, ...tokens]);
      toast.success('Token berhasil dibuat!');
      setShowTokenModal(false);
      setTokenForm({ expires_hours: 72, note: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gagal membuat token');
    } finally {
      setGenerating(false);
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
  if (!project) return null;

  // Status colors with inline styles for light mode compatibility
  const getStatusStyle = (status) => {
    const styles = {
      active: { backgroundColor: 'rgba(5, 150, 105, 0.15)', color: 'var(--accent-green)', borderColor: 'rgba(5, 150, 105, 0.3)' },
      completed: { backgroundColor: 'rgba(8, 145, 178, 0.15)', color: 'var(--accent-cyan)', borderColor: 'rgba(8, 145, 178, 0.3)' },
      archived: { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)', borderColor: 'var(--border-primary)' }
    };
    return styles[status] || styles.archived;
  };

  const getTokenStatusStyle = (status) => {
    const styles = {
      active: { backgroundColor: 'rgba(5, 150, 105, 0.15)', color: 'var(--accent-green)' },
      used: { backgroundColor: 'rgba(8, 145, 178, 0.15)', color: 'var(--accent-cyan)' },
      expired: { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' },
      revoked: { backgroundColor: 'rgba(220, 38, 38, 0.15)', color: 'var(--accent-red)' }
    };
    return styles[status] || styles.expired;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/projects"
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-2xl lg:text-3xl" style={{ color: 'var(--text-primary)' }}>
              {project.name}
            </h1>
            <span 
              className="px-2 py-1 text-xs rounded font-semibold"
              style={{ ...getStatusStyle(project.status), border: '1px solid' }}
            >
              {project.status}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Project Details</p>
        </div>
        <button
          onClick={() => setShowTokenModal(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Key className="w-4 h-4" />
          Generate Token
        </button>
      </div>

      {/* Project Info */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 card-cyber p-6">
          <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
            Project Information
          </h3>
          
          {project.description && (
            <p className="mb-6" style={{ color: 'var(--text-tertiary)' }}>{project.description}</p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Client Name</p>
                  <p style={{ color: 'var(--text-primary)' }}>{project.client_name}</p>
                </div>
              </div>
              
              {project.client_email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Client Email</p>
                    <a 
                      href={`mailto:${project.client_email}`} 
                      className="transition-colors font-medium"
                      style={{ color: 'var(--accent-cyan)' }}
                    >
                      {project.client_email}
                    </a>
                  </div>
                </div>
              )}
              
              {project.client_company && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Company</p>
                    <p style={{ color: 'var(--text-primary)' }}>{project.client_company}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {project.project_url && (
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Project URL</p>
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors font-medium"
                      style={{ color: 'var(--accent-cyan)' }}
                    >
                      {project.project_url}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Created</p>
                  <p style={{ color: 'var(--text-primary)' }}>
                    {format(new Date(project.created_at), 'dd MMMM yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-primary)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Tags</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-mono rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--bg-tertiary)', 
                      color: 'var(--text-tertiary)',
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="card-cyber p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(124, 58, 237, 0.15)' }}>
                <MessageSquare className="w-5 h-5" style={{ color: 'var(--accent-purple)' }} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                  {testimonials.length}
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Testimonials</p>
              </div>
            </div>
          </div>

          <div className="card-cyber p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(5, 150, 105, 0.15)' }}>
                <Key className="w-5 h-5" style={{ color: 'var(--accent-green)' }} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                  {tokens.filter(t => t.status === 'active').length}
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Active Tokens</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Tokens */}
      <div className="card-cyber p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            Invite Tokens
          </h3>
          <button
            onClick={() => setShowTokenModal(true)}
            className="btn-secondary text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Token
          </button>
        </div>

        {tokens.length > 0 ? (
          <div className="space-y-3">
            {tokens.map((token) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-primary)' 
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className="px-2 py-1 text-xs rounded font-semibold"
                        style={getTokenStatusStyle(token.status)}
                      >
                        {token.status}
                      </span>
                      {token.note && (
                        <span className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>
                          {token.note}
                        </span>
                      )}
                    </div>
                    <p 
                      className="font-mono text-sm truncate"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {token.invite_url}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      Expires: {format(new Date(token.expires_at), 'dd MMM yyyy HH:mm')}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(token.invite_url, token.id)}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      backgroundColor: copiedToken === token.id ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-secondary)',
                      color: copiedToken === token.id ? 'var(--accent-green)' : 'var(--text-muted)',
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    {copiedToken === token.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Key className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Belum ada token untuk proyek ini</p>
            <button
              onClick={() => setShowTokenModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Generate First Token
            </button>
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div className="card-cyber p-6">
        <h3 className="font-display font-bold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
          Testimonials ({testimonials.length})
        </h3>

        {testimonials.length > 0 ? (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-primary)' 
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {testimonial.client_name}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {testimonial.client_role}
                      {testimonial.client_role && testimonial.client_company && ' @ '}
                      {testimonial.client_company}
                    </p>
                  </div>
                  <StarRating rating={testimonial.rating} size="sm" />
                </div>
                <h5 className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  "{testimonial.title}"
                </h5>
                <p className="text-sm line-clamp-3" style={{ color: 'var(--text-tertiary)' }}>
                  {testimonial.content}
                </p>
                <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  {format(new Date(testimonial.created_at), 'dd MMM yyyy')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }}>Belum ada testimoni untuk proyek ini</p>
          </div>
        )}
      </div>

      {/* Generate Token Modal */}
      <Modal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        title="Generate Invite Token"
      >
        <form onSubmit={generateToken} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Valid For
            </label>
            <select
              value={tokenForm.expires_hours}
              onChange={(e) => setTokenForm({ ...tokenForm, expires_hours: Number(e.target.value) })}
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
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Note (Optional)
            </label>
            <input
              type="text"
              value={tokenForm.note}
              onChange={(e) => setTokenForm({ ...tokenForm, note: e.target.value })}
              placeholder="e.g., Sent via WhatsApp"
              className="input-cyber"
            />
          </div>

          <div 
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              border: '1px solid var(--border-primary)' 
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Token ini hanya bisa digunakan <strong style={{ color: 'var(--text-primary)' }}>satu kali</strong>.
              Setelah klien mengirim testimoni, token akan otomatis hangus.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowTokenModal(false)}
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
              Generate Token
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;