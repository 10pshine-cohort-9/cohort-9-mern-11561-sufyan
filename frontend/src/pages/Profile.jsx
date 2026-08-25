import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Profile() {
  const { user, logout, login } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNameSave = async () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (editedName === user.name) {
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.put('/api/users/profile', { name: editedName }, config);
      
      login(response.data); 
      setEditedName(response.data.name); // <--- Synchronized state here
      toast.success('Profile updated successfully in database!');
      setIsEditingName(false);
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const config = { 
        headers: { 
          Authorization: `Bearer ${user.token}`, 
          'Content-Type': 'multipart/form-data' 
        } 
      };
      
      const { data } = await axios.put('/api/users/profile', formData, config);
      login(data); 
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={`min-h-[calc(100vh-80px)] p-4 flex items-center justify-center transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0c0e0c]' : 'bg-[#f4fbf7]'
    }`}>
      <div className={`max-w-sm w-full p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
        isDarkMode ? 'bg-[#121412]/80 border-amber-500/20 shadow-amber-500/5' : 'bg-white border-emerald-500/20 shadow-emerald-500/5'
      }`}>
        
        {/* Interactive Avatar Area */}
        <div className="flex justify-center mb-4 relative group w-max mx-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={isUploading}
            className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl border-[3px] shadow-md overflow-hidden relative cursor-pointer ${
              isDarkMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-emerald-600 text-white border-emerald-100'
            }`}
          >
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm">
              {isUploading ? (
                <span className="animate-pulse text-sm">...</span>
              ) : (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* User Details & Editable Name */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center min-h-[36px] mb-1">
            {isEditingName ? (
              <div className="flex items-center gap-1.5 animate-fade-in">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  autoFocus
                  className={`w-36 sm:w-44 px-3 py-1 rounded-xl text-sm font-bold text-center transition-all shadow-inner focus:outline-none focus:ring-2 ${
                    isDarkMode 
                      ? 'bg-[#0c0e0c] border border-amber-500/50 text-white focus:ring-amber-500/40 focus:border-amber-500' 
                      : 'bg-white border border-emerald-500/50 text-slate-900 focus:ring-emerald-500/40 focus:border-emerald-500'
                  }`}
                />
                <button
                  onClick={handleNameSave}
                  disabled={isSavingName}
                  className={`p-1.5 rounded-xl transition-all shadow-sm ${
                    isDarkMode ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => { setIsEditingName(false); setEditedName(user.name); }}
                  className={`p-1.5 rounded-xl transition-all ${
                    isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 cursor-pointer group" onClick={() => setIsEditingName(true)}>
                <h1 className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-amber-50' : 'text-slate-900'}`}>
                  {user.name}
                </h1>
                <button className={`p-1.5 rounded-md transition-all ${
                  isDarkMode 
                    ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' 
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <p className={`text-sm ${isDarkMode ? 'text-amber-200/60' : 'text-slate-500'}`}>
            {user.email}
          </p>
          
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full text-xs font-semibold border ${
            isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            Active Workspace
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <Link to="/" className={`w-full flex justify-center font-semibold py-3 rounded-xl transition-all text-sm ${
            isDarkMode ? 'bg-slate-900/50 text-amber-100 border border-amber-500/30 hover:bg-slate-800' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}>
            Back to Dashboard
          </Link>
          <button onClick={handleLogout} className={`w-full font-semibold py-3 rounded-xl transition-all shadow-sm text-sm ${
            isDarkMode ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
          }`}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;