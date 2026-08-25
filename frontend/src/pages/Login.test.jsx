import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Login from './Login';
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

describe('Login Component', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ login: mockLogin });
    useTheme.mockReturnValue({ isDarkMode: false, toggleTheme: vi.fn() });
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('renders the login form correctly', () => {
    renderLogin();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('yourname@gmail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('updates input values when the user types', async () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('yourname@gmail.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('toggles password visibility when the eye icon is clicked', async () => {
    renderLogin();
    
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const toggleButton = screen.getByLabelText('Show password');

    expect(passwordInput).toHaveAttribute('type', 'password');

    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await userEvent.click(screen.getByLabelText('Hide password'));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('submits the form successfully and navigates to home', async () => {
    const mockUserData = { id: 1, name: 'Test User', token: 'fake-token' };
    axios.post.mockResolvedValueOnce({ data: mockUserData });

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('yourname@gmail.com'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/users/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith(mockUserData);
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows an error toast when login fails', async () => {
    const errorMessage = 'Invalid email or password';
    axios.post.mockRejectedValueOnce({
      response: { data: { error: { message: errorMessage } } }
    });

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('yourname@gmail.com'), 'wrong@example.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });
});