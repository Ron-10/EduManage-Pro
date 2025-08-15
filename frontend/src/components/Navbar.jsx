import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-dark">Welcome, {user?.name}</h2>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Role: {user?.role}</span>
        <button
          onClick={handleLogout}
          className="btn btn-primary text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}