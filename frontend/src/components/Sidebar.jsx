import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Students', path: '/students', icon: '🎓' },
  { name: 'Attendance', path: '/attendance', icon: '✅' },
  { name: 'Fees', path: '/fees', icon: '💰' },
  { name: 'Exams', path: '/exams', icon: '📝' },
  { name: 'Library', path: '/library', icon: '📚' },
  { name: 'Messages', path: '/messages', icon: '💬' },
  { name: 'Profile', path: '/profile', icon: '👤' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">EduManage Pro</h1>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition ${
              location.pathname === item.path ? 'bg-primary text-white' : ''
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}