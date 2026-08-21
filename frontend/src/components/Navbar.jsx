import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // State for menus
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 border-b ${
      isDarkMode 
        ? 'bg-[#0c0e0c]/80 border-amber-500/20 backdrop-blur-xl text-amber-100' 
        : 'bg-white/80 border-emerald-500/20 backdrop-blur-xl text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-active:scale-95 ${
            isDarkMode 
              ? 'bg-gradient-to-tr from-amber-500 to-yellow-600 text-slate-950 shadow-amber-500/20' 
              : 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-emerald-500/20'
          }`}>
            ⚡
          </div>
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight">
            Ink<span className={isDarkMode ? 'text-amber-400' : 'text-emerald-600'}>Spire</span>
          </span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Theme Toggle Button - Round */}
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full border transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
              isDarkMode 
                ? 'bg-slate-900 border-amber-500/30 text-amber-400 hover:bg-slate-800' 
                : 'bg-emerald-50 border-emerald-500/30 text-emerald-700 hover:bg-emerald-100'
            }`}
            title="Toggle Theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            /* --- LOGGED IN: Profile Avatar & Dropdown --- */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-2 sm:gap-3 p-1 sm:pr-4 rounded-full border transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode 
                    ? 'bg-[#121412] border-amber-500/30 hover:border-amber-400/50 focus:ring-amber-500/50 focus:ring-offset-[#0c0e0c]' 
                    : 'bg-white border-emerald-500/30 hover:border-emerald-500/60 focus:ring-emerald-500/50 focus:ring-offset-white'
                }`}
              >
                {/* Avatar (Always visible on mobile & desktop) */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm border-2 overflow-hidden transition-transform ${
                  isDarkMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-emerald-600 text-white border-emerald-100'
                }`}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                
                {/* Desktop Name & Chevron (Hidden on smallest screens) */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm font-bold truncate max-w-[120px]">{user.name}</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-amber-500/70' : 'text-emerald-600/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className={`absolute right-0 mt-3 w-64 rounded-3xl border shadow-2xl overflow-hidden origin-top-right animate-fade-in ${
                  isDarkMode 
                    ? 'bg-[#121412] border-amber-500/20 shadow-amber-500/10' 
                    : 'bg-white border-emerald-500/20 shadow-emerald-500/10'
                }`}>
                  {/* User Info Header */}
                  <div className={`px-5 py-4 border-b ${isDarkMode ? 'border-amber-500/10 bg-amber-500/5' : 'border-emerald-500/10 bg-emerald-50/50'}`}>
                    <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-amber-50' : 'text-slate-900'}`}>
                      {user.name}
                    </p>
                    <p className={`text-xs truncate mt-0.5 ${isDarkMode ? 'text-amber-200/60' : 'text-slate-500'}`}>
                      {user.email}
                    </p>
                  </div>
                  
                  {/* Menu Links */}
                  <div className="p-2">
                    <Link 
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                        isDarkMode 
                          ? 'text-amber-100/90 hover:bg-slate-800 hover:text-amber-400' 
                          : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Account Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-2xl text-sm font-semibold transition-colors ${
                        isDarkMode 
                          ? 'text-red-400 hover:bg-red-500/10' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* --- LOGGED OUT: Action Buttons --- */
            <>
              {/* Desktop View */}
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors hover:opacity-70">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-amber-500/20 hover:opacity-90' 
                      : 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-emerald-500/20 hover:opacity-95'
                  }`}
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile View Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`sm:hidden p-2 rounded-xl border focus:outline-none ${
                  isDarkMode ? 'border-amber-500/30 text-amber-400 bg-[#121412]' : 'border-emerald-500/30 text-emerald-700 bg-emerald-50'
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- MOBILE MENU (Only shown when LOGGED OUT) --- */}
      {!user && isMobileMenuOpen && (
        <div className={`sm:hidden absolute w-full px-6 py-5 flex flex-col gap-3 border-b shadow-2xl ${
          isDarkMode ? 'bg-[#121412] border-amber-500/20' : 'bg-white border-emerald-500/20'
        }`}>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={`text-center text-sm font-semibold py-3 rounded-2xl border transition-colors ${
            isDarkMode ? 'border-amber-500/30 text-amber-100 hover:bg-slate-800' : 'border-emerald-200 text-emerald-900 hover:bg-emerald-50'
          }`}>
            Sign In
          </Link>
          <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className={`text-center text-sm font-semibold py-3 rounded-2xl text-white shadow-md ${
            isDarkMode 
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold' 
              : 'bg-gradient-to-r from-emerald-600 to-green-500'
          }`}>
            Create Account
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;