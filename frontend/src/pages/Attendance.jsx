// frontend/src/pages/Attendance.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        // Add attendance status for each student
        const studentsWithAttendance = await Promise.all(
          res.data.map(async (student) => {
            const attRes = await api.get(`/attendance/${student.id}?date=${selectedDate}`);
            return { ...student, status: attRes.data.status || 'absent' };
          })
        );
        setStudents(studentsWithAttendance);
      } catch (err) {
        console.error('Failed to fetch attendance');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedDate]);

  const handleStatusChange = async (studentId, status) => {
    try {
      await api.post('/attendance', {
        student_id: studentId,
        date: selectedDate,
        status
      });

      setStudents(students.map(s =>
        s.id === studentId ? { ...s, status } : s
      ));
    } catch (err) {
      alert('Failed to update attendance');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Attendance</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <label className="block text-gray-700 mb-2">Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input"
        />
      </div>

      {loading ? (
        <p>Loading attendance...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.class_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      s.status === 'present' ? 'bg-green-100 text-green-800' :
                      s.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {['present', 'absent', 'late'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(s.id, status)}
                        className={`text-xs px-2 py-1 rounded ${
                          s.status === status
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}