import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Profile from './Profile';
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

describe('Profile Component', () => {
  const mockLogin = vi.fn();
  const mockLogout = vi.fn();
  const mockUser = {
    name: 'Sufyan Aslam',
    email: 'sufyan@gmail.com',
    token: 'fake-jwt-token',
    avatar: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser, login: mockLogin, logout: mockLogout });
    useTheme.mockReturnValue({ isDarkMode: false });
  });

  const renderProfile = () => {
    return render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
  };

  it('redirects to login if user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null, login: mockLogin, logout: mockLogout });
    renderProfile();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders user details and profile info correctly', () => {
    renderProfile();
    expect(screen.getByText('Sufyan Aslam')).toBeInTheDocument();
    expect(screen.getByText('sufyan@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('Active Workspace')).toBeInTheDocument();
  });

  it('allows editing the user name and saving successfully', async () => {
    const updatedUser = { ...mockUser, name: 'Sufyan Updated' };
    axios.put.mockResolvedValueOnce({ data: updatedUser });

    renderProfile();

    // Click the edit pencil button
    const editButton = screen.getByRole('button', { name: '' }); 
    await userEvent.click(editButton);

    // Type the new name into the input field
    const nameInput = screen.getByDisplayValue('Sufyan Aslam');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Sufyan Updated');

    // Click the save checkmark button
    const saveButton = screen.getAllByRole('button')[1];
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        '/api/users/profile',
        { name: 'Sufyan Updated' },
        { headers: { Authorization: 'Bearer fake-jwt-token' } }
      );
      expect(mockLogin).toHaveBeenCalledWith(updatedUser);
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully in database!');
    });
  });

  it('shows an error toast if saving an empty name', async () => {
    renderProfile();

    // Open name editor
    await userEvent.click(screen.getByRole('button', { name: '' }));

    const nameInput = screen.getByDisplayValue('Sufyan Aslam');
    await userEvent.clear(nameInput);

    // Click save
    const saveButton = screen.getAllByRole('button')[1];
    await userEvent.click(saveButton);

    expect(toast.error).toHaveBeenCalledWith('Name cannot be empty');
    expect(axios.put).not.toHaveBeenCalled();
  });

  it('logs out and redirects to login when Sign Out is clicked', async () => {
    renderProfile();

    const signOutButton = screen.getByRole('button', { name: 'Sign Out' });
    await userEvent.click(signOutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});