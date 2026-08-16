import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DOMPurify from 'dompurify';

// Import Context Hooks
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // Form & Edit states
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);

  const { title, content } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token, navigate]);

  const fetchNotes = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get('/api/notes', config);
      setNotes(response.data);
    } catch (error) {
      toast.error('Failed to fetch notes');
    }
  };

  const handleTitleChange = (value) => {
    setFormData((prevState) => ({ ...prevState, title: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prevState) => ({ ...prevState, content: value }));
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditNoteId(null);
    setFormData({ title: '', content: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setIsEditing(true);
    setEditNoteId(note._id);
    setFormData({ title: note.title, content: note.content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', content: '' });
    setIsEditing(false);
    setEditNoteId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      if (isEditing) {
        const response = await axios.put(`/api/notes/${editNoteId}`, formData, config);
        setNotes((prevNotes) => prevNotes.map((note) => (note._id === editNoteId ? response.data : note)));
        toast.success('Note updated successfully!');
      } else {
        const response = await axios.post('/api/notes', formData, config);
        setNotes((prevNotes) => [response.data, ...prevNotes]);
        toast.success('Note added successfully!');
      }
      
      closeModal();
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Failed to save note';
      toast.error(message);
    }
  };

  const confirmDelete = (id) => {
    setNoteToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const onDelete = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/notes/${noteToDelete}`, config);
      
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteToDelete));
      
      toast.success('Note deleted!');
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (error) {
      toast.error('Failed to delete note');
      setIsDeleteModalOpen(false);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const plainTitle = note.title.replace(/<[^>]*>?/gm, '');
    const plainContent = note.content.replace(/<[^>]*>?/gm, '');
    const query = searchQuery.toLowerCase();
    return plainTitle.toLowerCase().includes(query) || plainContent.toLowerCase().includes(query);
  });

  return (
    <div className={`min-h-[calc(100vh-80px)] transition-colors duration-300 pb-24 px-4 sm:px-6 lg:px-12 pt-8 ${
      isDarkMode ? 'bg-[#0c0e0c] text-amber-50' : 'bg-[#f4fbf7] text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Interactive Actions Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-opacity-20 border-current">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">My Workspace</h1>
              <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${
                isDarkMode 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                  : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
              }`}>
                {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
              </span>
            </div>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-amber-200/60' : 'text-slate-600'}`}>
              Capture ideas, organize thoughts, and access them seamlessly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 sm:w-96 lg:w-[420px]">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title or content..."
                className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm transition-all shadow-sm focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-[#121412] border border-amber-500/20 text-white placeholder-amber-200/30 focus:ring-amber-500/40 focus:border-amber-500' 
                    : 'bg-white border border-emerald-500/20 text-slate-900 placeholder-slate-400 focus:ring-emerald-500/40 focus:border-emerald-500'
                }`}
              />
            </div>

            <button
              onClick={openCreateModal}
              className={`flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-2xl active:scale-[0.98] transition-all shadow-lg cursor-pointer whitespace-nowrap text-sm ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-amber-500/20 hover:opacity-90' 
                  : 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-emerald-500/25 hover:opacity-95'
              }`}
            >
              <span className="text-lg leading-none">+</span> Add New Note
            </button>
          </div>
        </div>

        {/* Notes Grid Section */}
        <section className="w-full">
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNotes.map((note) => (
                <div 
                  key={note._id} 
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 ${
                    isDarkMode 
                      ? 'bg-[#121412]/80 border-amber-500/20 hover:border-amber-500/60 hover:shadow-amber-500/10' 
                      : 'bg-white border-emerald-500/20 hover:border-emerald-500/60 hover:shadow-emerald-500/10'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-full h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDarkMode ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-emerald-500 to-green-400'
                  }`} />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                        isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(note)}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            isDarkMode ? 'hover:text-amber-400 hover:bg-amber-500/10 text-amber-200/70' : 'hover:text-emerald-700 hover:bg-emerald-50 text-slate-500'
                          }`}
                          title="Edit Note"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => confirmDelete(note._id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                          title="Delete Note"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Sanitized Title & Content Below! */}
                    <div 
                      className={`text-base font-extrabold tracking-tight leading-snug prose max-w-none ${isDarkMode ? 'text-amber-50 prose-invert' : 'text-slate-900'}`}
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.title) }}
                    />
                    
                    <div 
                      className={`text-sm prose max-w-none line-clamp-4 overflow-hidden opacity-90 ${isDarkMode ? 'text-amber-200/70 prose-invert' : 'text-slate-600'}`} 
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center border border-dashed py-24 px-6 rounded-3xl max-w-xl mx-auto shadow-sm ${
              isDarkMode ? 'bg-[#121412]/40 border-amber-500/20 text-amber-200/80' : 'bg-white border-emerald-500/30 text-slate-600'
            }`}>
              <div className="text-6xl mb-4 animate-bounce">📭</div>
              <h3 className="text-xl font-bold tracking-tight">No notes found</h3>
              <p className={`text-sm mt-2 max-w-xs mx-auto ${isDarkMode ? 'text-amber-200/50' : 'text-slate-500'}`}>
                {searchQuery ? 'No notes matched your search criteria. Try a different query.' : 'Your workspace is empty. Click "Add New Note" to get started!'}
              </p>
            </div>
          )}
        </section>

        {/* CREATE / EDIT NOTE MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
            <div className={`border rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] transition-all transform scale-100 ${
              isDarkMode ? 'bg-[#121412] border-amber-500/30 text-amber-100' : 'bg-white border-emerald-500/30 text-slate-800'
            }`}>
              
              {/* Pinned Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 rounded-t-3xl ${
                isDarkMode ? 'border-amber-500/20 bg-amber-950/20' : 'border-emerald-500/20 bg-emerald-50/60'
              }`}>
                <h3 className="font-bold text-lg flex items-center gap-2.5">
                  {isEditing ? '✏️ Edit Note' : '✨ Create New Note'}
                </h3>
                <button 
                  onClick={closeModal}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer font-bold ${
                    isDarkMode 
                      ? 'text-amber-300/70 hover:text-amber-400 hover:bg-amber-500/20' 
                      : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Form Content */}
              <form onSubmit={onSubmit} id="note-form" className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
                <div className="space-y-2">
                  <label className="block text-sm font-bold">
                    Note Title
                  </label>
                  <div className={`rounded-2xl overflow-hidden border transition-all ${
                    isDarkMode ? 'bg-[#0c0e0c] border-amber-500/30' : 'bg-white border-emerald-500/30'
                  }`}>
                    <ReactQuill 
                      theme="snow" 
                      value={title} 
                      onChange={handleTitleChange} 
                      className="h-20 mb-10"
                      placeholder="Enter title..."
                      modules={{
                        toolbar: [
                          ['bold', 'italic', 'underline', 'strike'],
                          ['clean']
                        ]
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold">
                    Note Content
                  </label>
                  <div className={`rounded-2xl overflow-hidden border transition-all ${
                    isDarkMode ? 'bg-[#0c0e0c] border-amber-500/30' : 'bg-white border-emerald-500/30'
                  }`}>
                    <ReactQuill 
                      theme="snow" 
                      value={content} 
                      onChange={handleContentChange} 
                      className="min-h-[180px] pb-12"
                      placeholder="Write your note description here..."
                      modules={{
                        toolbar: [
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          ['clean']
                        ]
                      }}
                    />
                  </div>
                </div>
              </form>

              {/* Pinned Footer Actions */}
              <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 shrink-0 rounded-b-3xl ${
                isDarkMode ? 'border-amber-500/20 bg-amber-950/10' : 'border-emerald-500/20 bg-emerald-50/30'
              }`}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-current opacity-70 hover:opacity-100 transition-all cursor-pointer text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="note-form"
                  className={`px-6 py-2.5 font-bold rounded-xl active:scale-[0.98] transition-all shadow-lg cursor-pointer text-sm ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-amber-500/20' 
                      : 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-emerald-500/20'
                  }`}
                >
                  {isEditing ? 'Save Changes' : 'Create Note'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
            <div className={`border rounded-3xl shadow-2xl w-full max-w-md p-6 text-center ${
              isDarkMode ? 'bg-[#121412] border-amber-500/30 text-amber-100' : 'bg-white border-emerald-500/30 text-slate-900'
            }`}>
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-red-500/20 shadow-inner">
                ⚠️
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Note?</h3>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-amber-200/60' : 'text-slate-600'}`}>
                Are you sure you want to delete this note? This action is permanent and cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-current opacity-70 hover:opacity-100 transition-all cursor-pointer text-sm font-semibold flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  className="px-5 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-all cursor-pointer text-sm flex-1 shadow-lg shadow-red-600/25"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;