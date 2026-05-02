import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Users,
  Activity,
  Shield,
  LayoutDashboard,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputShell =
    'mt-2 flex items-center gap-3 px-4 py-3.5 bg-background-light/80 border border-glass-border rounded-2xl transition-all duration-300 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/25 focus-within:shadow-[0_0_24px_rgba(139,92,246,0.15)]';

  return (
    <div className="min-h-screen w-full bg-[#050811] text-text-primary overflow-x-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060a14] via-[#0a0e1a] to-[#050811]" />
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/12 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-[520px] w-[520px] rounded-full bg-secondary/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute top-1/2 left-0 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[80px]" />
        {/* Neon lines */}
        <div className="absolute top-24 left-[8%] h-px w-32 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute bottom-32 right-[12%] h-px w-48 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* —— LEFT: Branding —— */}
        <motion.aside
          className="relative hidden w-full flex-col justify-between overflow-hidden border-b border-white/5 px-8 py-10 lg:flex lg:w-[52%] lg:border-b-0 lg:border-r lg:border-white/5 lg:px-12 lg:py-14 xl:px-16"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full border border-primary/20 bg-primary/5 blur-2xl" />
          <div className="pointer-events-none absolute bottom-20 -left-16 h-56 w-56 rounded-full border border-secondary/20 bg-secondary/5 blur-2xl" />

          <div>
            <motion.div
              className="flex items-center gap-3"
              {...fadeUp}
              transition={{ delay: 0.05 }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-glow">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </motion.div>

            <motion.div
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-light shadow-[0_0_20px_rgba(139,92,246,0.2)]"
              {...fadeUp}
              transition={{ delay: 0.12 }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              All-in-One Productivity
            </motion.div>

            <motion.h1
              className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-white xl:text-5xl xl:leading-[1.1]"
              {...fadeUp}
              transition={{ delay: 0.18 }}
            >
              Manage Projects.
              <br />
              Track Progress.
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-cyan-400 bg-clip-text text-transparent">
                Achieve More.
              </span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-md text-base leading-relaxed text-text-secondary"
              {...fadeUp}
              transition={{ delay: 0.24 }}
            >
              Unify your team, ship faster, and stay ahead with real-time visibility across every
              project—from first idea to final delivery.
            </motion.p>

            <motion.ul
              className="mt-10 space-y-4"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.28 } }
              }}
            >
              {[
                { icon: Users, label: 'Team Collaboration', sub: 'Roles, tasks, and clarity' },
                { icon: Activity, label: 'Real-time Tracking', sub: 'Live progress & deadlines' },
                { icon: Shield, label: 'Secure & Reliable', sub: 'Enterprise-ready controls' }
              ].map(({ icon: Icon, label, sub }) => (
                <motion.li
                  key={label}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    show: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-primary-light">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{label}</p>
                    <p className="text-sm text-text-muted">{sub}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Floating dashboard preview */}
          <motion.div
            className="relative mt-12 lg:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/10 to-transparent opacity-60 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-glass/80 p-5 shadow-card backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-semibold text-white">Sprint overview</span>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
                  Live
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { v: '94%', l: 'On track' },
                  { v: '12', l: 'Tasks' },
                  { v: '4d', l: 'Ship' }
                ].map((k) => (
                  <div
                    key={k.l}
                    className="rounded-xl border border-white/5 bg-background-light/50 px-3 py-3"
                  >
                    <p className="text-lg font-bold text-white">{k.v}</p>
                    <p className="text-[10px] uppercase tracking-wider text-text-muted">{k.l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-background-lighter">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: '0%' }}
                  animate={{ width: '72%' }}
                  transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Velocity up 18% vs last sprint
              </div>
            </div>
          </motion.div>
        </motion.aside>

        {/* Mobile: compact brand strip */}
        <div className="relative flex items-center justify-between border-b border-white/5 px-4 py-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <span className="text-sm font-bold text-white">T</span>
            </div>
            <span className="font-bold text-white">TaskFlow</span>
          </div>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary-light">
            Productivity
          </span>
        </div>

        {/* —— RIGHT: Login —— */}
        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:py-14">
          <motion.div
            className="relative w-full max-w-[440px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-b from-primary/10 via-transparent to-secondary/5 blur-2xl" />
            <div className="relative rounded-2xl border border-white/10 bg-glass/90 p-8 shadow-[0_8px_48px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Welcome Back! <span className="inline-block">👋</span>
              </h2>
              <p className="mt-2 text-sm text-text-secondary sm:text-base">
                Sign in to continue to your account
              </p>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-5 overflow-hidden rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger-light"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="login-email" className="text-sm font-medium text-text-secondary">
                    Email
                  </label>
                  <div className={inputShell}>
                    <Mail className="h-[18px] w-[18px] shrink-0 text-text-muted" />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      className="w-full bg-transparent text-text-primary outline-none placeholder:text-text-muted"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="login-password" className="text-sm font-medium text-text-secondary">
                      Password
                    </label>
                    <a
                      href="#forgot"
                      className="text-xs font-medium text-primary-light hover:text-primary transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className={inputShell}>
                    <Lock className="h-[18px] w-[18px] shrink-0 text-text-muted" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className="w-full bg-transparent text-text-primary outline-none placeholder:text-text-muted"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="shrink-0 rounded-lg p-1 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-glass-border bg-background-light text-primary focus:ring-primary/40"
                  />
                  <span className="text-sm text-text-secondary">Remember me</span>
                </label>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={loading ? {} : { scale: 1.01, boxShadow: '0 0 32px rgba(139,92,246,0.35)' }}
                  whileTap={loading ? {} : { scale: 0.99 }}
                  className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary py-3.5 text-center text-sm font-semibold text-white shadow-glow transition-opacity disabled:opacity-60"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <span className="text-xs font-medium uppercase tracking-widest text-text-muted">or</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-background-light/50 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-background-light"
                  onClick={(e) => e.preventDefault()}
                  title="OAuth not configured"
                >
                  <FaGoogle className="h-4 w-4 text-red-400" />
                  Google
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-background-light/50 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-background-light"
                  onClick={(e) => e.preventDefault()}
                  title="OAuth not configured"
                >
                  <FaGithub className="h-4 w-4" />
                  GitHub
                </motion.button>
              </div>

              <p className="mt-8 text-center text-sm text-text-secondary">
                Don&apos;t have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-primary-light hover:text-primary transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Login;
