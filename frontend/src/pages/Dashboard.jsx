import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const { title, content } = formData;

  const navigate = useNavigate();
  // Retrieve the user (and their JWT token) from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  // Run this effect when the component mounts
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  // GET: Fetch all notes for the logged-in user
  const fetchNotes = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await axios.get('/api/notes', config);
      setNotes(response.data);
    } catch (error) {
      toast.error('Failed to fetch notes');
    }
  };

  // Handle input changes
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // POST: Create a new note
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await axios.post('/api/notes', formData, config);
      
      // Add the new note to the UI immediately
      setNotes([response.data, ...notes]);
      setFormData({ title: '', content: '' }); // Clear the form
      toast.success('Note added successfully!');
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Failed to add note';
      toast.error(message);
    }
  };

  // DELETE: Remove a note
  const onDelete = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.delete(`/api/notes/${id}`, config);
      
      // Remove the deleted note from the UI
      setNotes(notes.filter((note) => note._id !== id));
      toast.success('Note deleted!');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Welcome Section */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-500 text-lg">Here is your Notes Dashboard</p>
      </section>

      {/* Add Note Form */}
      <section className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-10">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={onChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter note title"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="content">Content</label>
            <textarea
              name="content"
              id="content"
              value={content}
              onChange={onChange}
              required
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              placeholder="What's on your mind?"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg mt-2"
          >
            Add Note
          </button>
        </form>
      </section>

      {/* Notes Grid Display */}
      <section>
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative hover:shadow-md transition-shadow">
                <button
                  onClick={() => onDelete(note._id)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                  title="Delete Note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <div className="text-xs text-gray-400 mb-2 font-medium">
                  {new Date(note.createdAt).toLocaleString('en-US')}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 pr-8">{note.title}</h2>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-50 p-10 rounded-xl border border-dashed border-gray-300">
            <h3 className="text-xl font-medium text-gray-600">You haven't set any notes yet.</h3>
            <p className="text-gray-500 mt-2">Use the form above to get started!</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;