import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiUser, FiMail, FiShield, FiTrash2, FiEdit, FiLoader } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'member', status: 'active', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchMembers();
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await api.get('/team', { params });
      setMembers(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (member = null) => {
    setError(null);
    setEditingMember(member);
    if (member) {
      setForm({
        name: member.name,
        email: member.email,
        role: member.role || 'member',
        status: member.status || 'active',
        password: ''
      });
    } else {
      setForm({ name: '', email: '', role: 'member', status: 'active', password: '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMember(null);
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }

    if (!editingMember && form.password.trim().length < 8) {
      setError('Password must be at least 8 characters for new members.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingMember) {
        await api.put(`/team/${editingMember._id}`, form);
        setSuccess('Team member updated successfully!');
      } else {
        await api.post('/team', form);
        setSuccess('Team member added successfully!');
      }
      closeModal();
      fetchMembers();
    } catch (err) {
      const validationError = err.response?.data?.errors?.[0]?.msg;
      setError(validationError || err.response?.data?.message || 'Unable to save team member.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Remove this team member?')) return;
    try {
      await api.delete(`/team/${memberId}`);
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Team</h1>
          <p className="text-text-secondary mt-1">Manage your project collaborators, roles, and contact details.</p>
        </div>
        {isAdmin && (
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <FiPlus /> Add member
          </button>
        )}
      </div>

      <div className="glass-card p-6">
        <div className="grid gap-4 mb-6 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team members..."
              className="w-full pl-11 pr-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary placeholder:text-text-muted"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <div className="rounded-2xl border border-white/10 bg-background-light/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Total Members</p>
            <p className="mt-2 text-2xl font-bold text-text-primary">{members.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-background-light/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Active</p>
            <p className="mt-2 text-2xl font-bold text-emerald-300">{members.filter((m) => m.status === 'active').length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-background-light/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Admins</p>
            <p className="mt-2 text-2xl font-bold text-primary">{members.filter((m) => m.role === 'admin').length}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader className="animate-spin text-primary" size={24} />
          </div>
        ) : (
          <div className="space-y-4">
            {members.length === 0 ? (
              <div className="rounded-3xl border border-white/10 p-10 text-center text-text-secondary">
                No team members found.
              </div>
            ) : (
              members.map(member => (
                <motion.div key={member._id} className="glass-card p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center text-primary">
                        <FiUser />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-text-primary">{member.name}</h2>
                        <p className="text-text-secondary">{member.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-text-secondary">
                      Tasks: {member.taskCount ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-text-secondary">
                      Projects: {member.projectCount ?? 0}
                    </span>
                    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                      member.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : member.status === 'busy'
                          ? 'bg-yellow-500/10 text-yellow-300'
                          : 'bg-slate-500/10 text-slate-300'
                    }`}>
                      {member.status || 'active'}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-text-secondary">
                      <FiShield /> {member.role}
                    </span>
                    {isAdmin && (
                      <button onClick={() => openModal(member)} className="text-primary hover:text-white flex items-center gap-2">
                        <FiEdit /> Edit
                      </button>
                    )}
                    {isAdmin && (
                      <button onClick={() => handleDelete(member._id)} className="text-rose-400 hover:text-rose-200 flex items-center gap-2">
                        <FiTrash2 /> Remove
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {isAdmin && modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl glass-card p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-text-secondary uppercase tracking-[0.2em]">{editingMember ? 'Edit member' : 'Invite member'}</p>
                <h2 className="text-2xl font-bold text-text-primary">{editingMember ? editingMember.name : 'Add a new collaborator'}</h2>
              </div>
              <button onClick={closeModal} className="text-text-secondary hover:text-white">Close</button>
            </div>

            {error && <p className="text-danger mb-4">{error}</p>}
            {success && <p className="text-success mb-4">{success}</p>}

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm text-text-secondary">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
                    placeholder="Alex Morgan"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-text-secondary">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
                    placeholder="alex@company.com"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-text-secondary">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-text-secondary">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
                >
                  <option value="active">Active</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {!editingMember && (
                <div className="space-y-3">
                  <label className="text-sm text-text-secondary">Temporary Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 bg-background-light border border-glass-border rounded-2xl text-text-primary"
                    placeholder="Minimum 8 characters"
                  />
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                {submitting ? <FiLoader className="animate-spin" /> : null}
                {editingMember ? 'Save member' : 'Invite member'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Team;
