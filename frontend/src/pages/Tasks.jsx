import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiCircle,
  FiChevronRight,
  FiCalendar,
  FiUser,
  FiFlag,
  FiClipboard,
  FiLoader
} from 'react-icons/fi';
import api from '../services/api';

const statusClasses = {
  pending: 'bg-yellow-500/10 text-yellow-200',
  'in-progress': 'bg-blue-500/10 text-blue-200',
  completed: 'bg-emerald-500/10 text-emerald-200',
  overdue: 'bg-rose-500/10 text-rose-200'
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({ project: '', assignedTo: '', status: '' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: '',
    project: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { user } = useAuth();
  const isMemberUser = user?.role === 'member';

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchMembers();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.project) params.project = filters.project;
      if (filters.assignedTo) params.assignedTo = filters.assignedTo;
      if (filters.status) params.status = filters.status;

      const response = await api.get('/tasks', { params });
      setTasks(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      const response = await api.get('/users/members');
      const allMembers = response.data.data || [];
      if (isMemberUser) {
        setMembers(allMembers.filter((member) => member._id === user?.id || member._id === user?._id));
      } else {
        setMembers(allMembers);
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  const updateFormField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors = {};

    if (!form.title.trim()) errors.title = 'Title is required.';
    if (!form.dueDate) errors.dueDate = 'Due date is required.';
    if (!form.project) errors.project = 'Project is required.';
    if (!form.assignedTo) errors.assignedTo = 'Assignee is required.';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openModal = (task = null) => {
    setError(null);
    setFieldErrors({});
    setEditingTask(task);
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        dueDate: task.dueDate?.slice(0, 10) || '',
        assignedTo: task.assignedTo?._id || '',
        project: task.project?._id || ''
      });
    } else {
      setForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        assignedTo: isMemberUser ? (user?.id || user?._id || '') : '',
        project: ''
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      setError('Please fix the required fields.');
      return;
    }

    try {
      console.log('Submitting task payload:', form);
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, form);
        setSuccess('Task updated successfully!');
      } else {
        await api.post('/tasks', form);
        setSuccess('Task created successfully!');
      }
      await fetchTasks();
      closeModal();
    } catch (err) {
      console.error('Task submit failed:', err?.response?.data || err);
      setError(err.response?.data?.message || 'Unable to save task.');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tasks</h1>
          <p className="text-text-secondary mt-1">A polished task board with filters and project assignment.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-[320px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-11 pr-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary placeholder:text-text-muted"
            />
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center justify-center gap-2">
            <FiPlus /> New task
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <motion.div className="glass-card p-6 space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {['pending', 'in-progress', 'completed', 'overdue'].map(status => (
              <div key={status} className="rounded-3xl border border-white/10 p-5 bg-white/5">
                <p className="text-sm text-text-secondary uppercase tracking-[0.2em]">{status.replace('-', ' ')}</p>
                <p className="mt-3 text-3xl font-bold text-text-primary">{tasks.filter(task => task.status === status).length}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <FiLoader className="animate-spin text-primary" size={24} />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="rounded-3xl border border-white/10 p-8 text-center text-text-secondary">
                No tasks found for your filters.
              </div>
            ) : (
              filteredTasks.map(task => (
                <div key={task._id} className="rounded-3xl border border-white/10 p-5 bg-background-light">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-text-primary">{task.title}</h2>
                      <p className="text-text-secondary mt-2">{task.project?.name || 'No project'} • Assigned to {task.assignedTo?.name || 'Unassigned'}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${statusClasses[task.status]}`}>
                      <FiCircle /> {task.status}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-text-secondary">
                    <div className="flex items-center gap-2"><FiCalendar /> {task.dueDate?.slice(0, 10)}</div>
                    <div className="flex items-center gap-2"><FiUser /> {task.assignedTo?.email || 'None'}</div>
                    <div className="flex items-center gap-2"><FiFlag /> {task.priority}</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 text-text-secondary">
                    <p className="line-clamp-2">{task.description || 'No description provided.'}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <button onClick={() => openModal(task)} className="text-primary hover:text-white">Edit</button>
                      {user.role === 'admin' && (
                        <button onClick={() => handleDelete(task._id)} className="text-rose-400 hover:text-rose-200">Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-3">
            <FiFilter size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-text-primary">Filters</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-secondary mb-2">Project</p>
              <select
                value={filters.project}
                onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
                className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
              >
                <option value="">All projects</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-2">Assigned to</p>
              <select
                value={filters.assignedTo}
                onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
                className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
              >
                <option value="">All members</option>
                {members.map(member => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-2">Status</p>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <button onClick={fetchTasks} className="btn-primary w-full">Apply filters</button>
          </div>
        </motion.div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl glass-card p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-text-secondary uppercase tracking-[0.2em]">{editingTask ? 'Edit Task' : 'Create Task'}</p>
                <h2 className="text-2xl font-bold text-text-primary">{editingTask ? editingTask.title : 'New task details'}</h2>
              </div>
              <button onClick={closeModal} className="text-text-secondary hover:text-white">Close</button>
            </div>

            {error && <p className="text-danger mb-4">{error}</p>}
            {success && <p className="text-success mb-4">{success}</p>}

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm text-text-secondary">Title</label>
                  <input value={form.title} onChange={(e) => updateFormField('title', e.target.value)} className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary" placeholder="Design system review" />
                  {fieldErrors.title && <p className="text-xs text-danger">{fieldErrors.title}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-text-secondary">Due date</label>
                  <input type="date" value={form.dueDate} onChange={(e) => updateFormField('dueDate', e.target.value)} className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary" />
                  {fieldErrors.dueDate && <p className="text-xs text-danger">{fieldErrors.dueDate}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-text-secondary">Description</label>
                <textarea value={form.description} onChange={(e) => updateFormField('description', e.target.value)} className="w-full min-h-[120px] px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-3">
                  <label className="text-sm text-text-secondary">Project</label>
                  <select value={form.project} onChange={(e) => updateFormField('project', e.target.value)} className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary">
                    <option value="">
                      {projectsLoading ? 'Loading projects...' : projects.length === 0 ? 'No projects available' : 'Select project'}
                    </option>
                    {projects.map(project => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))}
                  </select>
                  {fieldErrors.project && <p className="text-xs text-danger">{fieldErrors.project}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-text-secondary">Assigned to</label>
                  <select
                    value={form.assignedTo}
                    onChange={(e) => updateFormField('assignedTo', e.target.value)}
                    disabled={isMemberUser}
                    className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary disabled:opacity-70"
                  >
                    <option value="">
                      {membersLoading ? 'Loading members...' : members.length === 0 ? 'No members available' : 'Select member'}
                    </option>
                    {members.map(member => (
                      <option key={member._id} value={member._id}>{member.name}</option>
                    ))}
                  </select>
                  {isMemberUser && <p className="text-xs text-text-muted">Members can only create tasks assigned to themselves.</p>}
                  {fieldErrors.assignedTo && <p className="text-xs text-danger">{fieldErrors.assignedTo}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-text-secondary">Priority</label>
                  <select value={form.priority} onChange={(e) => updateFormField('priority', e.target.value)} className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm text-text-secondary">Status</label>
                  <select value={form.status} onChange={(e) => updateFormField('status', e.target.value)} className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button type="submit" className="btn-primary w-full">{editingTask ? 'Update task' : 'Create task'}</button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
