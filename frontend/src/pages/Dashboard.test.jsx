import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Dashboard from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('axios');

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../context/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

// Mock ReactQuill so it renders simple textareas in tests
vi.mock('react-quill-new', () => ({
  default: ({ value, onChange, placeholder }) => (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid="quill-editor"
    />
  ),
}));

describe('Dashboard Component', () => {
  const mockUser = {
    name: 'Sufyan Aslam',
    token: 'fake-jwt-token',
  };

  const mockNotes = [
    {
      _id: '1',
      title: 'First Test Note',
      content: 'This is the body content of the first note.',
      createdAt: '2026-08-01T00:00:00.000Z',
    },
    {
      _id: '2',
      title: 'Second Secret Note',
      content: 'Learning advanced MERN stack and Vitest.',
      createdAt: '2026-08-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
    useTheme.mockReturnValue({ isDarkMode: false });
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  it('redirects to login if user is unauthenticated', () => {
    useAuth.mockReturnValue({ user: null });
    renderDashboard();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('fetches and displays notes successfully on mount', async () => {
    axios.get.mockResolvedValueOnce({ data: mockNotes });

    renderDashboard();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/notes', {
        headers: { Authorization: 'Bearer fake-jwt-token' },
      });
      expect(screen.getByText('First Test Note')).toBeInTheDocument();
      expect(screen.getByText('Second Secret Note')).toBeInTheDocument();
    });
  });

  it('filters notes based on the search query input', async () => {
    axios.get.mockResolvedValueOnce({ data: mockNotes });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('First Test Note')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search notes by title or content...');
    await userEvent.type(searchInput, 'Secret');

    expect(screen.queryByText('First Test Note')).not.toBeInTheDocument();
    expect(screen.getByText('Second Secret Note')).toBeInTheDocument();
  });

  it('opens the modal when "Add New Note" is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    renderDashboard();

    const addNoteButton = screen.getByRole('button', { name: /\+ Add New Note/i });
    await userEvent.click(addNoteButton);

    expect(screen.getByText('✨ Create New Note')).toBeInTheDocument();
  });

  it('creates a new note successfully and updates state', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    const newNoteResponse = {
      _id: '3',
      title: 'Brand New Note',
      content: 'Created during test execution.',
      createdAt: '2026-08-03T00:00:00.000Z',
    };
    axios.post.mockResolvedValueOnce({ data: newNoteResponse });

    renderDashboard();

    // Open Modal
    await userEvent.click(screen.getByRole('button', { name: /\+ Add New Note/i }));

    // Type title and content into quill mock textareas
    const textareas = screen.getAllByTestId('quill-editor');
    await userEvent.type(textareas[0], 'Brand New Note');
    await userEvent.type(textareas[1], 'Created during test execution.');

    // Submit form
    await userEvent.click(screen.getByRole('button', { name: 'Create Note' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/notes',
        { title: 'Brand New Note', content: 'Created during test execution.' },
        { headers: { Authorization: 'Bearer fake-jwt-token' } }
      );
      expect(toast.success).toHaveBeenCalledWith('Note added successfully!');
      expect(screen.getByText('Brand New Note')).toBeInTheDocument();
    });
  });

  it('deletes a note when confirmed through delete modal', async () => {
    axios.get.mockResolvedValueOnce({ data: mockNotes });
    axios.delete.mockResolvedValueOnce({ data: { success: true } });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('First Test Note')).toBeInTheDocument();
    });

    // Click delete icon on the first note
    const deleteButtons = screen.getAllByTitle('Delete Note');
    await userEvent.click(deleteButtons[0]);

    // Check delete confirmation modal is open
    expect(screen.getByText('Delete Note?')).toBeInTheDocument();

    // Confirm deletion
    await userEvent.click(screen.getByRole('button', { name: 'Yes, Delete' }));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('/api/notes/1', {
        headers: { Authorization: 'Bearer fake-jwt-token' },
      });
      expect(toast.success).toHaveBeenCalledWith('Note deleted!');
      expect(screen.queryByText('First Test Note')).not.toBeInTheDocument();
    });
  });
});