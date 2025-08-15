import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data);
      } catch (err) {
        console.error('Failed to fetch students');
      }
    };
    fetchStudents();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Students</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.admission_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.class_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.parent_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.parent_phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}