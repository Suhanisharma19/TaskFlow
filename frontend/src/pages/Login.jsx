import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

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
    <div className="min-h-screen bg-[#050811] flex items-center justify-center text-white">
      <div className="w-full max-w-md p-6 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Login
        </h2>

        {error && (
          <div className="mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm">Email</label>
            <div className="flex items-center border border-white/20 rounded-lg px-3">
              <Mail className="w-4 h-4" />
              <input
                type="email"
                className="w-full bg-transparent p-2 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm">Password</label>
            <div className="flex items-center border border-white/20 rounded-lg px-3">
              <Lock className="w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-transparent p-2 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-purple-600 py-2 rounded-lg flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Login <ArrowRight />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;