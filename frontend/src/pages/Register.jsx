import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Import Context Hooks
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Pulling global state directly from Context API
  const { login } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === 'password') {
      setPasswordError('');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(''); 

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(email.trim())) {
      toast.error('Please enter a valid Gmail address (ending in @gmail.com)');
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    try {
      const response = await axios.post('/api/users/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      
      if (response.data) {
        // Use the context function instead of manual localStorage
        login(response.data);
        toast.success('Registration successful!');
        navigate('/'); 
      }
    } catch (error) {
      const message = 
        error.response?.data?.error?.message || 
        error.message || 
        'Registration failed';
      toast.error(message);
    }
  };

  return (
    <div className={`min-h-[100dvh] relative flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0c0e0c]' : 'bg-[#f4fbf7]'
    }`}>
      
      {/* Theme Toggle Button - Now perfectly round */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 flex items-center justify-center rounded-full border transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
          isDarkMode 
            ? 'bg-slate-900 border-amber-500/30 text-amber-400 hover:bg-slate-800' 
            : 'bg-emerald-50 border-emerald-500/30 text-emerald-700 hover:bg-emerald-100'
        }`}
        title="Toggle Theme"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Card - Responsive padding */}
      <div className={`max-w-md w-full p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
        isDarkMode 
          ? 'bg-[#121412]/80 border-amber-500/20 shadow-amber-500/5' 
          : 'bg-white border-emerald-500/20 shadow-emerald-500/5'
      }`}>
        <section className="text-center mb-6 sm:mb-8">
          <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg mb-4 ${
            isDarkMode 
              ? 'bg-gradient-to-tr from-amber-500 to-yellow-600 text-slate-950 shadow-amber-500/20' 
              : 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-emerald-500/20'
          }`}>
            ⚡
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${
            isDarkMode ? 'text-amber-50' : 'text-slate-900'
          }`}>
            Create Account
          </h1>
          <p className={`text-sm ${
            isDarkMode ? 'text-amber-200/60' : 'text-slate-500'
          }`}>
            Join InkSpire to organize your thoughts
          </p>
        </section>

        <section>
          <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:gap-5">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-amber-100/90' : 'text-slate-700'
              }`}>
                Full Name
              </label>
              <input 
                type="text" 
                name="name" 
                value={name} 
                placeholder="Enter your name" 
                onChange={onChange} 
                required 
                className={`w-full px-4 py-3 rounded-2xl text-sm transition-all shadow-inner focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-[#0c0e0c] border border-amber-500/30 text-white placeholder-amber-200/30 focus:ring-amber-500/40 focus:border-amber-500' 
                    : 'bg-white border border-emerald-500/30 text-slate-900 placeholder-slate-400 focus:ring-emerald-500/40 focus:border-emerald-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-amber-100/90' : 'text-slate-700'
              }`}>
                Gmail Address
              </label>
              <input 
                type="email" 
                name="email" 
                value={email} 
                placeholder="yourname@gmail.com" 
                onChange={onChange} 
                required 
                className={`w-full px-4 py-3 rounded-2xl text-sm transition-all shadow-inner focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-[#0c0e0c] border border-amber-500/30 text-white placeholder-amber-200/30 focus:ring-amber-500/40 focus:border-amber-500' 
                    : 'bg-white border border-emerald-500/30 text-slate-900 placeholder-slate-400 focus:ring-emerald-500/40 focus:border-emerald-500'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-amber-100/90' : 'text-slate-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={password} 
                  placeholder="Create a password" 
                  onChange={onChange} 
                  required 
                  className={`w-full pl-4 pr-12 py-3 rounded-2xl text-sm transition-all shadow-inner focus:outline-none focus:ring-2 ${
                    passwordError 
                      ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500' 
                      : isDarkMode 
                        ? 'bg-[#0c0e0c] border border-amber-500/30 text-white placeholder-amber-200/30 focus:ring-amber-500/40 focus:border-amber-500' 
                        : 'bg-white border border-emerald-500/30 text-slate-900 placeholder-slate-400 focus:ring-emerald-500/40 focus:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md focus:outline-none transition-colors ${
                    isDarkMode 
                      ? 'text-amber-200/50 hover:text-amber-400' 
                      : 'text-slate-400 hover:text-emerald-600'
                  }`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-2 font-medium pl-1">
                  {passwordError}
                </p>
              )}
            </div>

            <button 
              type="submit" 
              className={`w-full font-semibold py-3 sm:py-3.5 rounded-2xl active:scale-[0.98] transition-all shadow-lg mt-2 sm:mt-4 cursor-pointer ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-amber-500/20 hover:opacity-90' 
                  : 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-emerald-500/25 hover:opacity-95'
              }`}
            >
              Sign Up
            </button>
          </form>
        </section>
        
        <p className={`text-center text-sm mt-6 sm:mt-8 ${
          isDarkMode ? 'text-amber-200/60' : 'text-slate-500'
        }`}>
          Already have an account?{' '}
          <Link to="/login" className={`font-semibold hover:underline ${
            isDarkMode ? 'text-amber-400' : 'text-emerald-600'
          }`}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;