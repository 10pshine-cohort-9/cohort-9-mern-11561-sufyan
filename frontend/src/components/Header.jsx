import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  // Check if a user is currently logged in
  const user = JSON.parse(localStorage.getItem('user'));

  const onLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center p-5 mb-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
        <Link to="/">10P Notes</Link>
      </div>
      <ul className="flex gap-6 items-center">
        {user ? (
          <li>
            <button
              className="bg-gray-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors shadow-sm"
              onClick={onLogout}
            >
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;