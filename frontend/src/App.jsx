import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import Exams from './pages/Exams';
import Library from './pages/Library';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Layout from './components/Layout'; // Import Layout

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* This is the parent route for protected content */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout /> {/* Layout component renders header, sidebar, and Outlet */}
            </ProtectedRoute>
          }
        >
          {/* Child routes will be rendered inside Layout's Outlet */}
          <Route index element={<Dashboard />} /> {/* Default route for / */}
          <Route
            path="students"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route path="attendance" element={<Attendance />} />
          <Route path="fees" element={<Fees />} />
          <Route path="exams" element={<Exams />} />
          <Route path="library" element={<Library />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}