import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import {
  FiActivity,
  FiAlertCircle,
  FiArrowDownRight,
  FiArrowUpRight,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiLoader,
  FiRefreshCw,
  FiTarget,
  FiTrendingUp,
  FiUser
} from 'react-icons/fi';

const sparkleSets = {
  projects: [3, 5, 4, 7, 6, 8, 10],
  completed: [2, 4, 3, 6, 7, 8, 9],
  pending: [7, 7, 6, 5, 6, 5, 4],
  progress: [6, 5, 7, 6, 8, 7, 9],
  overdue: [4, 5, 4, 3, 3, 2, 2]
};

const formatRelativeTime = (value) => {
  const date = new Date(value);
  const now = new Date();
  const minutes = Math.floor((now - date) / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

const statusColors = {
  pending: 'text-yellow-300 bg-yellow-500/10 border-yellow-400/20',
  'in-progress': 'text-blue-300 bg-blue-500/10 border-blue-400/20',
  completed: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20',
  overdue: 'text-rose-300 bg-rose-500/10 border-rose-400/20'
};

const CountUpNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 900;
    const frames = 32;
    const step = Math.max(1, Math.ceil(value / frames));
    const interval = Math.floor(duration / frames);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const Sparkline = ({ points }) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const spread = Math.max(1, max - min);
  const normalized = points.map((point, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = 100 - ((point - min) / spread) * 100;
    return `${x},${y}`;
  });

  return (
    <svg viewBox="0 0 100 100" className="h-12 w-full">
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.9)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0.9)" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#sparklineGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={normalized.join(' ')}
      />
    </svg>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="skeleton h-8 w-56 rounded-xl" />
        <div className="skeleton h-4 w-72 rounded-lg" />
      </div>
      <div className="skeleton h-11 w-28 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5 space-y-4">
          <div className="skeleton h-4 w-28 rounded-lg" />
          <div className="skeleton h-8 w-20 rounded-lg" />
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 glass-card p-6 space-y-4">
        <div className="skeleton h-6 w-56 rounded-lg" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full rounded-xl" />
        ))}
      </div>
      <div className="glass-card p-6 space-y-4">
        <div className="skeleton h-6 w-36 rounded-lg" />
        <div className="skeleton h-48 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [taskTrends, setTaskTrends] = useState([]);
  const [activity, setActivity] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, trendsRes, activityRes, deadlinesRes, tasksRes, projectsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/task-trends'),
        api.get('/dashboard/activity'),
        api.get('/dashboard/deadlines'),
        api.get('/tasks'),
        api.get('/projects')
      ]);

      setStats(statsRes.data.data || {});
      setTaskTrends(trendsRes.data.data || []);
      setActivity((activityRes.data.data || []).slice(0, 5));
      setDeadlines((deadlinesRes.data.data || []).slice(0, 6));
      setRecentTasks((tasksRes.data.data || []).slice(0, 7));
      setProjects((projectsRes.data.data || []).slice(0, 5));
    } catch (fetchError) {
      console.error('Failed to fetch dashboard data:', fetchError);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-danger mb-4">{error}</p>
        <button onClick={fetchDashboardData} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  const completionRate = stats?.totalTasks
    ? Math.round(((stats?.completedTasks || 0) / stats.totalTasks) * 100)
    : 0;
  const overdueRate = stats?.totalTasks
    ? Math.round(((stats?.overdueTasks || 0) / stats.totalTasks) * 100)
    : 0;
  const distributionTotal = (stats?.taskDistribution || []).reduce((sum, item) => sum + item.value, 0) || 1;

  const donutSegments = (stats?.taskDistribution || []).map((item) => {
    const ratio = Math.round((item.value / distributionTotal) * 100);
    const color =
      item.status === 'completed'
        ? '#10b981'
        : item.status === 'in-progress'
          ? '#3b82f6'
          : item.status === 'overdue'
            ? '#f43f5e'
            : '#f59e0b';
    return { ...item, ratio, color };
  });

  const donutGradient = (() => {
    let cursor = 0;
    return donutSegments
      .map((segment) => {
        const start = cursor;
        const end = cursor + segment.ratio;
        cursor = end;
        return `${segment.color} ${start}% ${end}%`;
      })
      .join(', ');
  })();

  const metricCards = [
    {
      key: 'projects',
      label: 'Total Projects',
      value: stats?.totalProjects || 0,
      trend: '+8.2%',
      direction: 'up',
      icon: FiBriefcase,
      spark: sparkleSets.projects,
      gradient: 'from-violet-500/40 to-fuchsia-500/30'
    },
    {
      key: 'completed',
      label: 'Completed Tasks',
      value: stats?.completedTasks || 0,
      trend: `${completionRate}%`,
      direction: 'up',
      icon: FiCheckCircle,
      spark: sparkleSets.completed,
      gradient: 'from-emerald-500/40 to-cyan-500/30'
    },
    {
      key: 'pending',
      label: 'Pending Tasks',
      value: stats?.pendingTasks || 0,
      trend: '-2.3%',
      direction: 'down',
      icon: FiClock,
      spark: sparkleSets.pending,
      gradient: 'from-amber-500/40 to-yellow-500/30'
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      value: stats?.inProgressTasks || 0,
      trend: '+4.7%',
      direction: 'up',
      icon: FiClock,
      spark: sparkleSets.progress,
      gradient: 'from-blue-500/40 to-indigo-500/30'
    },
    {
      key: 'overdue',
      label: 'Overdue Tasks',
      value: stats?.overdueTasks || 0,
      trend: `${overdueRate}%`,
      direction: 'down',
      icon: FiAlertCircle,
      spark: sparkleSets.overdue,
      gradient: 'from-rose-500/40 to-orange-500/30'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative space-y-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-500/25 blur-[110px]"
          animate={{ x: [0, 30, 0], y: [0, 40, 0], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-16 right-16 h-64 w-64 rounded-full bg-cyan-500/20 blur-[120px]"
          animate={{ x: [0, -24, 0], y: [0, 26, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Executive Overview</p>
          <h1 className="mt-1 text-3xl font-bold text-text-primary">Performance Command Center</h1>
          <p className="mt-1 text-text-secondary">Live operational pulse across delivery, team velocity, and deadlines.</p>
        </div>
        <motion.button
          onClick={fetchDashboardData}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-secondary flex items-center gap-2 self-start md:self-auto"
        >
          <FiRefreshCw /> Refresh
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card, index) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-glass p-5 shadow-card backdrop-blur-xl"
          >
            <div className={`absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl`} />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-text-secondary">{card.label}</p>
                <div className="rounded-xl bg-white/10 p-2 text-white">
                  <card.icon size={18} />
                </div>
              </div>
              <div className="flex items-end justify-between gap-3">
                <h3 className="text-3xl font-bold text-text-primary">
                  <CountUpNumber value={card.value} />
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    card.direction === 'up'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-rose-500/15 text-rose-300'
                  }`}
                >
                  {card.direction === 'up' ? <FiArrowUpRight size={13} /> : <FiArrowDownRight size={13} />}
                  {card.trend}
                </span>
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-background/50 px-3 py-2">
                <Sparkline points={card.spark} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="xl:col-span-2 space-y-5"
        >
          <div className="glass-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">Project Progress</h2>
              <p className="text-sm text-text-muted">Active portfolio completion</p>
            </div>
            <div className="space-y-4">
              {projects.length === 0 ? (
                <p className="rounded-xl border border-white/10 bg-background-light p-4 text-sm text-text-secondary">
                  No projects available yet. Create a project to track delivery progress.
                </p>
              ) : (
                projects.map((project, idx) => (
                  <motion.div
                    key={project._id}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="rounded-xl border border-white/10 bg-background-light/60 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{project.name}</p>
                        <p className="text-xs text-text-muted">Priority: {project.priority || 'medium'}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{project.progress || 0}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress || 0}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.08 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.45)]"
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">Recent Tasks</h2>
              <p className="text-sm text-text-muted">{recentTasks.length} items</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-text-muted">
                    <th className="pb-3 font-medium">Task</th>
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Assignee</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTasks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="pt-4 text-text-secondary">
                        No recent tasks found.
                      </td>
                    </tr>
                  ) : (
                    recentTasks.map((task) => (
                      <tr key={task._id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 pr-3 text-text-primary">{task.title}</td>
                        <td className="py-3 pr-3 text-text-secondary">{task.project?.name || 'N/A'}</td>
                        <td className="py-3 pr-3 text-text-secondary">{task.assignedTo?.name || 'Unassigned'}</td>
                        <td className="py-3 pr-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${statusColors[task.status] || 'text-text-secondary'}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 text-text-secondary">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '--'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5"
        >
          <div className="glass-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <FiBarChart2 className="text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Task Distribution</h3>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <div
                className="mx-auto h-32 w-32 rounded-full border border-white/10"
                style={{ background: `conic-gradient(${donutGradient || '#374151 0% 100%'})` }}
              >
                <div className="m-4 flex h-24 w-24 items-center justify-center rounded-full bg-background/90 text-xs text-text-secondary">
                  {stats?.totalTasks || 0} Tasks
                </div>
              </div>
              <div className="space-y-2">
                {donutSegments.map((segment) => (
                  <div key={segment.status} className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-2 text-text-secondary">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} />
                      {segment.status}
                    </span>
                    <span className="font-semibold text-text-primary">{segment.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <FiCalendar className="text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Upcoming Deadlines</h3>
            </div>
            <div className="space-y-3">
              {deadlines.length === 0 ? (
                <p className="text-sm text-text-secondary">No tasks due in the next 7 days.</p>
              ) : (
                deadlines.map((task) => (
                  <div key={task._id} className="rounded-xl border border-white/10 bg-background-light/60 p-3">
                    <p className="text-sm font-medium text-text-primary">{task.title}</p>
                    <p className="text-xs text-text-secondary">{task.project?.name || 'General'}</p>
                    <p className="mt-1 text-xs text-primary">
                      Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '--'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Productivity Insights</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-background-light/60 p-3">
                <p className="text-text-muted">Completion Rate</p>
                <p className="text-xl font-bold text-text-primary">{completionRate}%</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-background-light/60 p-3">
                <p className="text-text-muted">Recent Throughput (30d)</p>
                <p className="text-xl font-bold text-text-primary">{taskTrends.reduce((sum, item) => sum + item.tasks, 0)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-background-light/60 p-3">
                <p className="text-text-muted">Focus Signal</p>
                <p className="text-text-primary">
                  {(stats?.inProgressTasks || 0) > (stats?.pendingTasks || 0)
                    ? 'Execution velocity is healthy across active workstreams.'
                    : 'Backlog pressure is rising. Consider rebalancing assignments.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiActivity className="text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Team Activity Feed</h3>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-text-muted">Live Stream</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {activity.length === 0 ? (
            <p className="text-sm text-text-secondary">No recent team activity available.</p>
          ) : (
            activity.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-background-light/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-text-primary">
                      <span className="font-semibold">{item.user}</span> {item.action}{' '}
                      <span className="font-semibold text-primary">{item.taskTitle}</span>
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      <FiTarget className="mr-1 inline" />
                      {item.projectName}
                    </p>
                  </div>
                  <div className="rounded-full bg-white/10 p-2 text-text-muted">
                    <FiUser size={13} />
                  </div>
                </div>
                <p className="mt-2 text-xs text-text-muted">{formatRelativeTime(item.timestamp)}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
