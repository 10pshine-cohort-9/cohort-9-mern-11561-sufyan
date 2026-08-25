import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../context/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

describe('Navbar Component', () => {
  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('renders the brand name InkSpire', () => {
    useAuth.mockReturnValue({ user: null, logout: vi.fn() });
    useTheme.mockReturnValue({ isDarkMode: false, toggleTheme: vi.fn() });

    renderNavbar();

    expect(screen.getByText(/Ink/i)).toBeInTheDocument();
    expect(screen.getByText(/Spire/i)).toBeInTheDocument();
  });

  it('shows Login and Get Started buttons when logged out', () => {
    useAuth.mockReturnValue({ user: null, logout: vi.fn() });
    useTheme.mockReturnValue({ isDarkMode: false, toggleTheme: vi.fn() });

    renderNavbar();

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('shows user profile information when logged in', () => {
    const mockUser = { name: 'Test User', email: 'test@example.com' };
    useAuth.mockReturnValue({ user: mockUser, logout: vi.fn() });
    useTheme.mockReturnValue({ isDarkMode: false, toggleTheme: vi.fn() });

    renderNavbar();

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('calls toggleTheme when the theme button is clicked', async () => {
    const mockToggleTheme = vi.fn();
    useAuth.mockReturnValue({ user: null, logout: vi.fn() });
    useTheme.mockReturnValue({ isDarkMode: false, toggleTheme: mockToggleTheme });

    renderNavbar();

    const themeButton = screen.getByTitle('Toggle Theme');
    await userEvent.click(themeButton);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});