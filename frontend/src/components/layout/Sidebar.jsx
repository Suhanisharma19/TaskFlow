import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiFolder, 
  FiCheckSquare, 
  FiMenu, 
  FiX,
  FiLogOut,
  FiUsers
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/projects', icon: FiFolder, label: 'Projects' },
    { path: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
    ...(user?.role === 'admin' ? [{ path: '/team', icon: FiUsers, label: 'Team' }] : [])
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-card text-text-primary"
      >
        {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? '80px' : '260px',
          x: mobileOpen ? 0 : window.innerWidth < 1024 ? -260 : 0
        }}
        className={`fixed left-0 top-0 h-full glass-card border-r border-glass-border z-40
          lg:translate-x-0 transition-all duration-300`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <motion.div
              className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white font-bold text-xl">T</span>
            </motion.div>
            {!collapsed && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold gradient-primary bg-clip-text text-transparent"
              >
                TaskFlow
              </motion.h1>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      relative overflow-hidden
                      ${isActive
                        ? 'gradient-primary text-white shadow-glow'
                        : 'text-text-secondary hover:bg-background-light hover:text-text-primary hover:shadow-[0_0_24px_rgba(139,92,246,0.18)]'
                      }`}
                  >
                    {!isActive && (
                      <span className="pointer-events-none absolute inset-y-0 -left-20 w-20 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm transition-all duration-300 group-hover:left-full" />
                    )}
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="pt-4 border-t border-glass-border">
            <div className={`flex items-center gap-3 px-2 mb-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                  <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
                </motion.div>
              )}
            </div>

            <motion.button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary
                hover:bg-danger/10 hover:text-danger transition-all duration-200 w-full
                ${collapsed ? 'justify-center' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiLogOut size={20} />
              {!collapsed && <span className="font-medium">Logout</span>}
            </motion.button>
          </div>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full 
              bg-background-lighter border border-glass-border items-center justify-center
              text-text-secondary hover:text-primary transition-colors"
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
