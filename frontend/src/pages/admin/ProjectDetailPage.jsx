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

  const statusColors = {
    active: 'bg-neon-green/10 text-neon-green border-neon-green/30',
    completed: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
    archived: 'bg-void-600/10 text-void-400 border-void-600/30'
  };

  const tokenStatusColors = {
    active: 'bg-neon-green/10 text-neon-green',
    used: 'bg-neon-cyan/10 text-neon-cyan',
    expired: 'bg-void-600/10 text-void-400',
    revoked: 'bg-red-500/10 text-red-400'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/projects"
          className="p-2 rounded-lg bg-void-800/50 text-void-400 hover:text-white hover:bg-void-700/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-2xl lg:text-3xl text-white">
              {project.name}
            </h1>
            <span className={`px-2 py-1 text-xs rounded border ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
          <p className="text-void-400">Project Details</p>
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
          <h3 className="font-display font-bold text-lg text-white mb-4">
            Project Information
          </h3>
          
          {project.description && (
            <p className="text-void-300 mb-6">{project.description}</p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-void-500" />
                <div>
                  <p className="text-xs text-void-500">Client Name</p>
                  <p className="text-white">{project.client_name}</p>
                </div>
              </div>
              
              {project.client_email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-void-500" />
                  <div>
                    <p className="text-xs text-void-500">Client Email</p>
                    <a href={`mailto:${project.client_email}`} className="text-neon-cyan hover:text-neon-purple transition-colors">
                      {project.client_email}
                    </a>
                  </div>
                </div>
              )}
              
              {project.client_company && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-void-500" />
                  <div>
                    <p className="text-xs text-void-500">Company</p>
                    <p className="text-white">{project.client_company}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {project.project_url && (
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-void-500" />
                  <div>
                    <p className="text-xs text-void-500">Project URL</p>
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-cyan hover:text-neon-purple transition-colors"
                    >
                      {project.project_url}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-void-500" />
                <div>
                  <p className="text-xs text-void-500">Created</p>
                  <p className="text-white">
                    {format(new Date(project.created_at), 'dd MMMM yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-void-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-void-500" />
                <p className="text-sm text-void-400">Tags</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-void-800/50 text-void-300 rounded-full border border-void-700/50"
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
              <div className="p-2 rounded-lg bg-neon-purple/10">
                <MessageSquare className="w-5 h-5 text-neon-purple" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-white">
                  {testimonials.length}
                </p>
                <p className="text-sm text-void-400">Testimonials</p>
              </div>
            </div>
          </div>

          <div className="card-cyber p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-neon-green/10">
                <Key className="w-5 h-5 text-neon-green" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-white">
                  {tokens.filter(t => t.status === 'active').length}
                </p>
                <p className="text-sm text-void-400">Active Tokens</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Tokens */}
      <div className="card-cyber p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-lg text-white">
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
                className="p-4 rounded-xl bg-void-800/30 border border-void-700/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs rounded ${tokenStatusColors[token.status]}`}>
                        {token.status}
                      </span>
                      {token.note && (
                        <span className="text-sm text-void-400 truncate">
                          {token.note}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-sm text-void-300 truncate">
                      {token.invite_url}
                    </p>
                    <p className="text-xs text-void-500 mt-1">
                      Expires: {format(new Date(token.expires_at), 'dd MMM yyyy HH:mm')}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(token.invite_url, token.id)}
                    className={`p-2 rounded-lg transition-all ${
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
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Key className="w-12 h-12 text-void-600 mx-auto mb-4" />
            <p className="text-void-400 mb-4">Belum ada token untuk proyek ini</p>
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
        <h3 className="font-display font-bold text-lg text-white mb-6">
          Testimonials ({testimonials.length})
        </h3>

        {testimonials.length > 0 ? (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-4 rounded-xl bg-void-800/30 border border-void-700/50"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.client_name}</h4>
                    <p className="text-sm text-void-500">
                      {testimonial.client_role}
                      {testimonial.client_role && testimonial.client_company && ' @ '}
                      {testimonial.client_company}
                    </p>
                  </div>
                  <StarRating rating={testimonial.rating} size="sm" />
                </div>
                <h5 className="font-medium text-void-200 mb-2">"{testimonial.title}"</h5>
                <p className="text-void-400 text-sm line-clamp-3">{testimonial.content}</p>
                <p className="text-xs text-void-500 mt-3">
                  {format(new Date(testimonial.created_at), 'dd MMM yyyy')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-void-600 mx-auto mb-4" />
            <p className="text-void-400">Belum ada testimoni untuk proyek ini</p>
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
            <label className="block text-sm font-medium text-void-300 mb-2">
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
            <label className="block text-sm font-medium text-void-300 mb-2">
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

          <div className="p-4 rounded-lg bg-void-800/50 border border-void-700/50">
            <p className="text-sm text-void-400">
              Token ini hanya bisa digunakan <strong className="text-white">satu kali</strong>.
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
