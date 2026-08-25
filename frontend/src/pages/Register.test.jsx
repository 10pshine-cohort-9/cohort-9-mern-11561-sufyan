import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Register from './Register';
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

describe('Register Component', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ login: mockLogin });
    useTheme.mockReturnValue({ isDarkMode: false, toggleTheme: vi.fn() });
  });

  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it('renders the registration form elements', () => {
    renderRegister();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('yourname@gmail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();
  });

  it('shows an error toast if email does not end with @gmail.com', async () => {
    renderRegister();

    await userEvent.type(screen.getByPlaceholderText('Enter your name'), 'Test User');
    await userEvent.type(screen.getByPlaceholderText('yourname@gmail.com'), 'user@yahoo.com');
    await userEvent.type(screen.getByPlaceholderText('Create a password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(toast.error).toHaveBeenCalledWith('Please enter a valid Gmail address (ending in @gmail.com)');
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('shows inline error text if password is less than 8 characters', async () => {
    renderRegister();

    await userEvent.type(screen.getByPlaceholderText('Enter your name'), 'Test User');
    await userEvent.type(screen.getByPlaceholderText('yourname@gmail.com'), 'test@gmail.com');
    await userEvent.type(screen.getByPlaceholderText('Create a password'), 'short');
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(screen.getByText('Password must be at least 8 characters long.')).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('submits successfully when validation passes and navigates home', async () => {
    const mockUserData = { id: 1, name: 'Test User', token: 'fake-token' };
    axios.post.mockResolvedValueOnce({ data: mockUserData });

    renderRegister();

    await userEvent.type(screen.getByPlaceholderText('Enter your name'), 'Test User');
    await userEvent.type(screen.getByPlaceholderText('yourname@gmail.com'), 'test@gmail.com');
    await userEvent.type(screen.getByPlaceholderText('Create a password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/users/register', {
        name: 'Test User',
        email: 'test@gmail.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith(mockUserData);
      expect(toast.success).toHaveBeenCalledWith('Registration successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});