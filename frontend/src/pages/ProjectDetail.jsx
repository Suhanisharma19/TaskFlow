import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiUsers,
  FiCalendar,
  FiFlag,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiList,
  FiLoader
} from 'react-icons/fi';
import api from '../services/api';

const statusStyles = {
  active: 'bg-emerald-500/15 text-emerald-200',
  completed: 'bg-sky-500/15 text-sky-200',
  delayed: 'bg-rose-500/15 text-rose-200'
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.data);
    } catch (err) {
      setError('Unable to load project details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks/project/${id}`);
      setTasks(response.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <FiLoader className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-danger mb-4">{error}</p>
        <button onClick={() => navigate('/projects')} className="btn-primary">
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <button onClick={() => navigate('/projects')} className="text-text-secondary hover:text-white flex items-center gap-2">
        <FiArrowLeft /> Back to Projects
      </button>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <motion.div className="glass-card p-8 space-y-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-text-secondary uppercase tracking-[0.2em]">Project Overview</p>
                <h1 className="text-3xl font-bold text-text-primary">{project.name}</h1>
              </div>
              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusStyles[project.status] || 'bg-slate-700 text-white'}`}>
                {project.status}
              </span>
            </div>

            <p className="text-text-secondary leading-7">{project.description || 'No description available for this project yet.'}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card p-5 border border-white/10">
              <p className="text-sm text-text-secondary uppercase tracking-[0.2em] mb-3">Deadline</p>
              <div className="flex items-center gap-3 text-text-primary font-semibold">
                <FiCalendar /> {project.deadline?.slice(0, 10)}
              </div>
            </div>
            <div className="glass-card p-5 border border-white/10">
              <p className="text-sm text-text-secondary uppercase tracking-[0.2em] mb-3">Progress</p>
              <div className="text-4xl font-bold text-text-primary">{project.progress ?? 0}%</div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-text-secondary uppercase tracking-[0.2em]">Team</p>
            <div className="flex flex-wrap gap-3">
              {project.teamMembers?.length > 0 ? (
                project.teamMembers.map(member => (
                  <span key={member._id} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 text-text-secondary">
                    <FiUsers /> {member.name}
                  </span>
                ))
              ) : (
                <p className="text-text-muted">No team members assigned yet.</p>
              )}
            </div>
          </div>

          <div className="glass-card p-5 bg-white/5 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-text-secondary uppercase tracking-[0.2em]">Completion</p>
                <h3 className="text-xl font-semibold text-text-primary">{project.progress ?? 0}%</h3>
              </div>
              <div className="text-text-secondary text-sm">{project.totalTasks ?? 0} tasks</div>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark" style={{ width: `${project.progress ?? 0}%` }} />
            </div>
          </div>
        </motion.div>

        <motion.div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-text-secondary uppercase tracking-[0.2em]">Latest activity</p>
              <h2 className="text-2xl font-bold text-text-primary">Task snapshot</h2>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="glass-card p-4 bg-background-light border border-glass-border">
              <div className="flex items-center gap-3 text-text-secondary">
                <FiList />
                <span>{tasks.length} tasks in this project</span>
              </div>
            </div>
            <div className="glass-card p-4 bg-background-light border border-glass-border">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase text-text-secondary">In progress</p>
                  <p className="text-xl font-semibold text-text-primary">{tasks.filter(task => task.status === 'in-progress').length}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase text-text-secondary">Completed</p>
                  <p className="text-xl font-semibold text-text-primary">{tasks.filter(task => task.status === 'completed').length}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase text-text-secondary">Overdue</p>
                  <p className="text-xl font-semibold text-text-primary">{tasks.filter(task => task.status === 'overdue').length}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div className="glass-card p-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Task list</h2>
            <p className="text-text-secondary">All tasks inside this project.</p>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="rounded-3xl border border-white/10 p-8 text-center text-text-secondary">
              <FiAlertTriangle className="mx-auto text-3xl text-primary mb-3" />
              This project does not have tasks yet.
            </div>
          ) : (
            tasks.map(task => (
              <div key={task._id} className="rounded-3xl border border-white/10 p-5 bg-background-light">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{task.title}</h3>
                    <p className="text-text-secondary mt-1">{task.assignedTo?.name || 'Unassigned'} • {task.dueDate?.slice(0, 10)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${task.status === 'completed' ? 'bg-sky-500/15 text-sky-200' : task.status === 'in-progress' ? 'bg-amber-500/15 text-amber-200' : 'bg-rose-500/15 text-rose-200'}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-text-secondary mt-3">{task.description || 'No task description provided.'}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetail;
