import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        const role = result.user?.role;

        navigate(role === 'admin' ? '/dashboard' : '/tasks');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-32 h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-32 h-[460px] w-[460px] rounded-full bg-secondary/15 blur-3xl animate-pulse-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-glow"
              whileHover={{ scale: 1.03 }}
            >
              <span className="text-white font-bold text-2xl">T</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-text-primary">Welcome back</h2>
            <p className="text-text-secondary mt-2">Sign in to continue to TaskFlow.</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-5 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger-light text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-text-secondary">Email</label>
              <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-background-light border border-glass-border rounded-2xl">
                <Mail className="w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-muted"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary">Password</label>
              <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-background-light border border-glass-border rounded-2xl">
                <Lock className="w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-muted"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-sm text-text-secondary">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-light transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;