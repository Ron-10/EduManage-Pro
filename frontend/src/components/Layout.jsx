import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom'; // Import Outlet
import { jwtDecode } from 'jwt-decode'; // For decoding token if needed for role display
export default function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userRole = 'Guest';
  let userName = 'User';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
      // You might also store user name in localStorage on login
      userName = localStorage.getItem('userName') || decoded.name || 'Admin User';
    } catch (error) {
      console.error('Failed to decode token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Clear user data too
    localStorage.removeItem('userName'); // Clear user name if stored
    navigate('/login');
  };

  // Define sidebar links based on roles (example)
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: '📊', roles: ['admin', 'teacher', 'student'] },
    { name: 'Students', path: '/students', icon: '🎓', roles: ['admin', 'teacher'] },
    { name: 'Attendance', path: '/attendance', icon: '✅', roles: ['admin', 'teacher'] },
    { name: 'Fees', path: '/fees', icon: '💰', roles: ['admin'] },
    { name: 'Exams', path: '/exams', icon: '📝', roles: ['admin', 'teacher', 'student'] },
    { name: 'Library', path: '/library', icon: '📚', roles: ['admin', 'teacher', 'student'] },
    { name: 'Messages', path: '/messages', icon: '💬', roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Profile', path: '/profile', icon: '👤', roles: ['admin', 'teacher', 'student', 'parent'] },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-center text-xl font-bold border-b border-gray-700">
          EduManage Pro
        </div>
        <nav className="flex-1 px-2 py-4">
          {navLinks.map((link) => (
            // Only render links if user has the role
            (link.roles.includes(userRole) || userRole === 'admin') && (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </Link>
            )
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
          <div className="text-2xl font-semibold">Welcome, {userName}</div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Role: {userRole}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* <--- THIS IS THE KEY! */}
        </main>
      </div>
    </div>
  );
}