import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiUsers,
  FiCalendar,
  FiFlag,
  FiChevronRight,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiLoader
} from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
  active: 'bg-emerald-500/15 text-emerald-200',
  completed: 'bg-sky-500/15 text-sky-200',
  delayed: 'bg-rose-500/15 text-rose-200'
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    deadline: '',
    priority: 'medium',
    status: 'active',
    teamMembers: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/team');
      setUsers(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const openModal = (project = null) => {
    setError('');
    setEditProject(project);
    if (project) {
      setForm({
        name: project.name,
        description: project.description || '',
        deadline: project.deadline?.slice(0, 10) || '',
        priority: project.priority || 'medium',
        status: project.status || 'active',
        teamMembers: project.teamMembers?.map(member => member._id) || []
      });
    } else {
      setForm({
        name: '',
        description: '',
        deadline: '',
        priority: 'medium',
        status: 'active',
        teamMembers: []
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditProject(null);
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!form.deadline) {
      setError('Deadline is required');
      return;
    }

    try {
      if (editProject) {
        await api.put(`/projects/${editProject._id}`, form);
        setSuccess('Project updated successfully!');
      } else {
        await api.post('/projects', form);
        setSuccess('Project created successfully!');
      }
      await fetchProjects();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save project');
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Delete this project and all related tasks?')) return;
    try {
      await api.delete(`/projects/${projectId}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase()) ||
    project.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
          <p className="text-text-secondary mt-1">Manage your project pipeline without changing the premium theme.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-[320px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-11 pr-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary placeholder:text-text-muted"
            />
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => openModal()}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <FiPlus /> Create project
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-text-secondary uppercase tracking-[0.2em]">{project.priority}</p>
                <h2 className="text-xl font-bold text-text-primary">{project.name}</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[project.status] || 'bg-slate-700 text-white'}`}>
                {project.status}
              </span>
            </div>

            <p className="text-text-secondary line-clamp-3">{project.description || 'No description yet.'}</p>

            <div className="grid grid-cols-2 gap-3 text-sm text-text-secondary">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em]">Deadline</p>
                <p>{project.deadline?.slice(0, 10)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em]">Progress</p>
                <p>{project.progress ?? 0}%</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark" style={{ width: `${project.progress ?? 0}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>{project.totalTasks ?? 0} tasks</span>
                <span>{project.overdueTasks ?? 0} overdue</span>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs text-text-secondary">
              {project.teamMembers?.slice(0, 3).map(member => (
                <span key={member._id} className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5">
                  <FiUsers /> {member.name}
                </span>
              ))}
              {project.teamMembers?.length > 3 && (
                <span className="text-text-muted">+{project.teamMembers.length - 3} more</span>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-4">
              <Link to={`/projects/${project._id}`} className="text-primary hover:text-primary-light flex items-center gap-2">
                View details <FiChevronRight />
              </Link>
              {user?.role === 'admin' && (
                <div className="flex items-center gap-2">
                  <button onClick={() => openModal(project)} className="text-text-secondary hover:text-white">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(project._id)} className="text-rose-400 hover:text-rose-200">
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {loading && (
        <div className="glass-card p-8 flex items-center justify-center gap-3">
          <FiLoader className="animate-spin text-primary" size={24} />
          <span>Loading projects...</span>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl glass-card p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-text-secondary uppercase tracking-[0.2em]">{editProject ? 'Edit Project' : 'Create Project'}</p>
                <h2 className="text-2xl font-bold text-text-primary">{editProject ? editProject.name : 'New project details'}</h2>
              </div>
              <button onClick={closeModal} className="text-text-secondary hover:text-white">Close</button>
            </div>

            {error && <p className="text-danger mb-4">{error}</p>}
            {success && <p className="text-success mb-4">{success}</p>}

            <form className="grid grid-cols-1 lg:grid-cols-2 gap-5" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="text-sm text-text-secondary">Project Name</label>
                <input
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
                  placeholder="Sprint dashboard redesign"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm text-text-secondary">Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => handleFormChange('deadline', e.target.value)}
                  className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
                />
              </div>

              <div className="space-y-3 lg:col-span-2">
                <label className="text-sm text-text-secondary">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full min-h-[120px] px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm text-text-secondary">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => handleFormChange('priority', e.target.value)}
                  className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-text-secondary">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>

              <div className="lg:col-span-2 space-y-3">
                <label className="text-sm text-text-secondary">Team Members</label>
                <select
                  multiple
                  value={form.teamMembers}
                  onChange={(e) => handleFormChange('teamMembers', Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full min-h-[120px] px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
                >
                  {users.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} — {member.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2 flex flex-col sm:flex-row items-center gap-3 mt-2">
                <button type="submit" className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                  {editProject ? 'Update project' : 'Create project'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary w-full sm:w-auto">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Projects;
