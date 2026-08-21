import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages & Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile'; // 1. Import the new Profile page

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen w-full flex flex-col">
          {!hideNavbar && <Navbar />}
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} /> {/* 2. Add the Route */}
            </Routes>
          </main>
        </div>
        <ToastContainer />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;