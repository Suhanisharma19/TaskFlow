import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiLoader } from 'react-icons/fi';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member',
    adminAccessKey: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.role === 'admin' && !formData.adminAccessKey.trim()) {
      setError('Admin access key is required for admin account.');
      return;
    }

    setLoading(true);

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      adminAccessKey: formData.role === 'admin' ? formData.adminAccessKey.trim() : undefined
    });
    
    if (result.success) {
      const landingRoute = formData.role === 'admin' ? '/dashboard' : '/tasks';
      navigate(landingRoute);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <span className="text-white font-bold text-3xl">T</span>
            </motion.div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-text-secondary mt-2">Join TaskFlow today</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-background-light border border-glass-border 
                    rounded-xl text-text-primary placeholder-text-muted input-focus"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-background-light border border-glass-border 
                    rounded-xl text-text-primary placeholder-text-muted input-focus"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Account Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background-light border border-glass-border 
                  rounded-xl text-text-primary input-focus"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {formData.role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Set Admin Access Key
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="password"
                    name="adminAccessKey"
                    value={formData.adminAccessKey}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-background-light border border-glass-border 
                      rounded-xl text-text-primary placeholder-text-muted input-focus"
                    placeholder="Create your admin access key"
                    required
                  />
                </div>
                <p className="text-xs text-text-muted mt-2">Use this key for your admin account setup. Minimum 8 characters.</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-background-light border border-glass-border 
                    rounded-xl text-text-primary placeholder-text-muted input-focus"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-background-light border border-glass-border 
                    rounded-xl text-text-primary placeholder-text-muted input-focus"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-light font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
