import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  FolderKanban,
  MessageSquare,
  ExternalLink,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Key,
  Calendar,
  Tag,
  Loader2,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { adminAPI, parseErrorMessage } from '../../utils/api';
import Modal from '../../components/ui/Modal';
import CyberSelect from '../../components/ui/CyberSelect';
import LoadingScreen from '../../components/ui/LoadingScreen';
import Pagination from '../../components/ui/Pagination';

const ITEMS_PER_PAGE = 6;

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' }
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_name: '',
    client_email: '',
    client_company: '',
    project_url: '',
    tags: '',
    status: 'active'
  });

  const fetchProjects = async () => {
    try {
      const response = await adminAPI.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Gagal memuat data proyek');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of projects section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      client_name: '',
      client_email: '',
      client_company: '',
      project_url: '',
      tags: '',
      status: 'active'
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Project Name harus diisi');
      return;
    }
    if (!formData.client_name.trim()) {
      toast.error('Client Name harus diisi');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const data = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        client_name: formData.client_name.trim(),
        client_email: formData.client_email.trim() || null,
        client_company: formData.client_company.trim() || null,
        project_url: formData.project_url.trim() || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        status: formData.status
      };
      
      console.log('Sending project data:', data);
      
      await adminAPI.createProject(data);
      toast.success('Proyek berhasil dibuat!');
      setShowCreateModal(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Create project error:', error.response?.data);
      toast.error(parseErrorMessage(error, 'Gagal membuat proyek'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Project Name harus diisi');
      return;
    }
    if (!formData.client_name.trim()) {
      toast.error('Client Name harus diisi');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const data = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        client_name: formData.client_name.trim(),
        client_email: formData.client_email.trim() || null,
        client_company: formData.client_company.trim() || null,
        project_url: formData.project_url.trim() || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        status: formData.status
      };
      
      await adminAPI.updateProject(selectedProject.id, data);
      toast.success('Proyek berhasil diperbarui!');
      setShowEditModal(false);
      setSelectedProject(null);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Update project error:', error.response?.data);
      toast.error(parseErrorMessage(error, 'Gagal memperbarui proyek'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await adminAPI.deleteProject(selectedProject.id);
      toast.success('Proyek berhasil dihapus!');
      setShowDeleteModal(false);
      setSelectedProject(null);
      fetchProjects();
      // Reset to page 1 if current page becomes empty
      if (paginatedProjects.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error(parseErrorMessage(error, 'Gagal menghapus proyek'));
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      client_name: project.client_name,
      client_email: project.client_email || '',
      client_company: project.client_company || '',
      project_url: project.project_url || '',
      tags: project.tags?.join(', ') || '',
      status: project.status
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  if (loading) return <LoadingScreen />;

  const statusColors = {
    active: 'bg-neon-green/10 text-neon-green border-neon-green/30',
    completed: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
    archived: 'bg-void-600/10 text-void-400 border-void-600/30'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-white mb-2">
            Projects
          </h1>
          <p className="text-void-400">
            Kelola semua proyek dan klien Anda di sini.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Search */}
      <div className="card-cyber p-4">
        <div className="relative">
          <div className="input-icon-left">
            <Search className="w-5 h-5 text-void-500" />
          </div>
          <input
            type="text"
            placeholder="Cari proyek atau klien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-cyber input-with-icon-left"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm text-neon-cyan hover:text-neon-purple transition-colors"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Pagination - Always visible */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredProjects.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {/* Projects Grid */}
      {paginatedProjects.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-cyber p-6 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-neon-cyan" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-white line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-void-500">{project.client_name}</p>
                    </div>
                  </div>
                  
                  {/* Actions dropdown */}
                  <div className="relative group/menu">
                    <button className="p-2 rounded-lg text-void-500 hover:text-white hover:bg-void-800/50 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-40 py-1 bg-void-800 border border-void-700 rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                      <Link
                        to={`/admin/projects/${project.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-void-300 hover:text-white hover:bg-void-700/50"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                      <button
                        onClick={() => openEditModal(project)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-void-300 hover:text-white hover:bg-void-700/50"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(project)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-void-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Tags */}
                {project.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs font-mono bg-void-800/50 text-void-400 rounded border border-void-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-xs text-void-500">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 py-4 border-t border-void-700/50">
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-neon-purple" />
                    <span className="text-void-300">
                      {project.testimonial_count} reviews
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded border ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 text-xs text-void-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(project.created_at), 'dd MMM yyyy')}
                  </span>
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-neon-cyan hover:text-neon-purple transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Site
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="card-cyber p-12 text-center">
          <FolderKanban className="w-12 h-12 text-void-600 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-white mb-2">
            {searchQuery ? 'Tidak ada proyek ditemukan' : 'Belum ada proyek'}
          </h3>
          <p className="text-void-400 mb-6">
            {searchQuery
              ? 'Coba kata kunci lain atau hapus filter'
              : 'Buat proyek pertama Anda untuk mulai mengumpulkan testimoni'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          )}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., E-Commerce Website"
              className="input-cyber"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the project..."
              rows={3}
              className="input-cyber resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Client's name"
                className="input-cyber"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                Client Email
              </label>
              <input
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                placeholder="client@email.com"
                className="input-cyber"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                Client Company
              </label>
              <input
                type="text"
                value={formData.client_company}
                onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                placeholder="Company name"
                className="input-cyber"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                Project URL
              </label>
              <input
                type="url"
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                placeholder="https://..."
                className="input-cyber"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="web, e-commerce, react"
              className="input-cyber"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Status
            </label>
            <CyberSelect
              options={statusOptions}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
              icon={Activity}
            />
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
              disabled={submitting}
              className="btn-primary flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProject(null);
        }}
        title="Edit Project"
        size="lg"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          {/* Same form fields as create */}
          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-cyber"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="input-cyber resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="input-cyber"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                Client Email
              </label>
              <input
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                className="input-cyber"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                Client Company
              </label>
              <input
                type="text"
                value={formData.client_company}
                onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                className="input-cyber"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                Project URL
              </label>
              <input
                type="url"
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                className="input-cyber"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="input-cyber"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Status
            </label>
            <CyberSelect
              options={statusOptions}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
              icon={Activity}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setSelectedProject(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProject(null);
        }}
        title="Delete Project"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-void-300 mb-2">
            Apakah Anda yakin ingin menghapus proyek
          </p>
          <p className="font-semibold text-white mb-4">
            "{selectedProject?.name}"?
          </p>
          <p className="text-sm text-void-500 mb-6">
            Semua token dan testimoni terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedProject(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="btn-danger flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectsPage;