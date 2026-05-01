import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  Shield, 
  Users, 
  TrendingUp,
  Loader2,
  Globe,
  Sparkles,
  ArrowRight,
  Zap,
  Circle
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

    const result = await login(email, password);
    
    if (result.success) {
      const landingRoute = result.user.role === 'admin' ? '/dashboard' : '/tasks';
      navigate(landingRoute);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050811] flex overflow-hidden relative selection:bg-purple-500/30 selection:text-white">
      {/* === ANIMATED BACKGROUND === */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-purple-600 via-purple-500 to-transparent rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.12, 0.2, 0.12],
            x: [0, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500 via-blue-500 to-transparent rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 rounded-full blur-[160px]"
        />
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -40, 0],
              x: [0, Math.sin(i * 0.5) * 30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{ 
              duration: 6 + i * 0.8, 
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
            className={`absolute rounded-full ${
              i % 4 === 0 ? 'bg-purple-400' : 
              i % 4 === 1 ? 'bg-cyan-400' : 
              i % 4 === 2 ? 'bg-blue-400' : 'bg-pink-400'
            }`}
            style={{
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              left: `${5 + (i * 8) % 90}%`,
              top: `${10 + (i * 13) % 80}%`,
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050811]/50 to-[#050811]" />
      </div>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 flex relative z-10">
        {/* === LEFT SIDE - BRANDING === */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-12 xl:p-16 relative">
          {/* Top Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Logo */}
            <div className="flex items-center gap-4 mb-8">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-400 to-cyan-400 flex items-center justify-center shadow-2xl">
                  <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs text-gray-500 tracking-wider uppercase">Enterprise Suite</p>
              </div>
            </div>
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-xl shadow-lg shadow-purple-500/10"
            >
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping opacity-75" />
              </div>
              <span className="text-sm text-purple-200 font-semibold tracking-wide">All-in-One Productivity Platform</span>
            </motion.div>
          </motion.div>

          {/* Center - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <h2 className="text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Manage Projects.
                <br />
                <span className="relative">
                  Track Progress.
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-full blur-sm"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                  />
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Achieve More.
                </span>
              </h2>
              
              <p className="text-xl text-gray-400 max-w-xl leading-relaxed font-light">
                Streamline workflows, collaborate seamlessly, and deliver exceptional results with our enterprise-grade platform trusted by industry leaders.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-5 pt-4">
              {[
                { icon: Users, text: 'Team Collaboration', desc: 'Real-time sync across your organization', color: 'purple' },
                { icon: Zap, text: 'Lightning Fast', desc: 'Optimized for peak performance', color: 'cyan' },
                { icon: Shield, text: 'Enterprise Security', desc: 'Bank-grade encryption & compliance', color: 'blue' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.15 }}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-5 group cursor-pointer"
                >
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${
                    feature.color === 'purple' ? 'from-purple-500/20 to-purple-600/20 border-purple-500/30' :
                    feature.color === 'cyan' ? 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30' :
                    'from-blue-500/20 to-blue-600/20 border-blue-500/30'
                  } border backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <feature.icon className={`w-7 h-7 ${
                      feature.color === 'purple' ? 'text-purple-400' :
                      feature.color === 'cyan' ? 'text-cyan-400' :
                      'text-blue-400'
                    }`} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors">{feature.text}</h3>
                    <p className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">{feature.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-2 transition-all ml-auto opacity-0 group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-purple-500/30 rounded-3xl blur-2xl opacity-40" />
            <div className="relative glass-card p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 shadow-lg" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 shadow-lg" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 shadow-lg" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-gray-400 font-medium">Live Dashboard</span>
                </div>
              </div>
              
              {/* Mock Dashboard Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-32 bg-gradient-to-r from-purple-400/40 to-purple-600/40 rounded-full" />
                  <div className="h-3 w-20 bg-gradient-to-r from-cyan-400/40 to-cyan-600/40 rounded-full" />
                </div>
                <div className="h-2.5 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-full w-full" />
                <div className="h-2.5 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full w-4/5" />
                <div className="flex gap-3 mt-6">
                  {[
                    { color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30', width: 'w-full' },
                    { color: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30', width: 'w-full' },
                    { color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30', width: 'w-full' },
                  ].map((item, i) => (
                    <div key={i} className={`${item.width} h-20 bg-gradient-to-br ${item.color} rounded-2xl border backdrop-blur-xl`}>
                      <div className="p-3 space-y-2">
                        <div className="h-2 bg-white/20 rounded-full w-3/4" />
                        <div className="h-2 bg-white/10 rounded-full w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* === RIGHT SIDE - LOGIN FORM === */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md relative"
          >
            {/* Ambient Glow Behind Card */}
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 rounded-[3rem] blur-3xl opacity-30" />
            
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>

            {/* Login Card */}
            <div className="relative">
              {/* Animated Border */}
              <motion.div
                className="absolute -inset-[2px] rounded-[2.5rem] opacity-50"
                style={{
                  background: 'linear-gradient(90deg, #8b5cf6, #06b6d4, #8b5cf6)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              <div className="relative bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-white/10">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-4xl sm:text-5xl font-black text-white">
                      Welcome Back
                    </h2>
                    <motion.span
                      animate={{ rotate: [0, 14, -8, 14, 0] }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="text-4xl"
                    >
                      👋
                    </motion.span>
                  </div>
                  <p className="text-gray-400 text-lg font-light">
                    Sign in to continue to your workspace
                  </p>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-300 px-5 py-4 rounded-2xl mb-6 text-sm flex items-center gap-3 backdrop-blur-xl"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">⚠️</span>
                      </div>
                      <span className="font-medium">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold text-gray-300 mb-2.5 ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity ${focusedInput === 'email' ? 'opacity-50' : ''}`} />
                      <div className={`relative flex items-center bg-gradient-to-br ${
                        focusedInput === 'email' 
                          ? 'from-white/10 to-white/5 border-purple-500/50' 
                          : 'from-white/5 to-white/[0.02] border-white/10 group-hover:border-white/20'
                      } border rounded-2xl transition-all duration-300`}>
                        <Mail className={`ml-5 w-5 h-5 transition-colors ${focusedInput === 'email' ? 'text-purple-400' : 'text-gray-500'}`} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedInput('email')}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full px-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                          placeholder="you@company.com"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Password Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-semibold text-gray-300 mb-2.5 ml-1">
                      Password
                    </label>
                    <div className="relative group">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity ${focusedInput === 'password' ? 'opacity-50' : ''}`} />
                      <div className={`relative flex items-center bg-gradient-to-br ${
                        focusedInput === 'password' 
                          ? 'from-white/10 to-white/5 border-purple-500/50' 
                          : 'from-white/5 to-white/[0.02] border-white/10 group-hover:border-white/20'
                      } border rounded-2xl transition-all duration-300`}>
                        <Lock className={`ml-5 w-5 h-5 transition-colors ${focusedInput === 'password' ? 'text-purple-400' : 'text-gray-500'}`} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedInput('password')}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full px-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                          placeholder="••••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="mr-3 p-2 rounded-xl text-gray-500 hover:text-purple-400 hover:bg-white/5 transition-all"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Remember Me & Forgot Password */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-between pt-2"
                  >
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <motion.div 
                          whileTap={{ scale: 0.9 }}
                          className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                            rememberMe 
                              ? 'bg-gradient-to-r from-purple-500 to-cyan-500 border-transparent shadow-lg shadow-purple-500/30' 
                              : 'border-gray-600 group-hover:border-purple-500/50'
                          }`}
                        >
                          <AnimatePresence>
                            {rememberMe && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={3} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-gray-300 font-medium">Remember me</span>
                    </label>
                    <motion.button 
                      type="button" 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                    >
                      Forgot password?
                    </motion.button>
                  </motion.div>

                  {/* Sign In Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="pt-2"
                  >
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative w-full py-4.5 px-6 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:from-purple-500 hover:via-purple-400 hover:to-cyan-400 text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 overflow-hidden"
                    >
                      {/* Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                        animate={{ translateX: ['0%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      
                      {loading ? (
                        <div className="flex items-center justify-center gap-3 relative z-10">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3 relative z-10">
                          <span className="text-lg">Sign In to Workspace</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </motion.button>
                  </motion.div>
                </form>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="relative my-7"
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-5 bg-transparent text-gray-500 text-sm font-medium">or continue with</span>
                  </div>
                </motion.div>

                {/* Social Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { icon: Globe, label: 'Google', hoverColor: 'hover:border-red-500/50 hover:bg-red-500/10', iconColor: 'group-hover:text-red-400' },
                    { icon: FaGithub, label: 'GitHub', hoverColor: 'hover:border-white/50 hover:bg-white/10', iconColor: 'group-hover:text-white' },
                  ].map((social, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 border border-white/10 rounded-2xl text-white transition-all duration-300 group ${social.hoverColor} backdrop-blur-xl`}
                    >
                      <social.icon className={`w-5 h-5 text-gray-400 ${social.iconColor} transition-colors`} />
                      <span className="text-sm font-semibold">{social.label}</span>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Signup Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8 text-center text-gray-400"
                >
                  Don't have an account?{' '}
                  <Link to="/signup" className="relative group text-purple-400 hover:text-purple-300 font-bold transition-colors inline-block">
                    Sign up for free
                    <motion.div
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
