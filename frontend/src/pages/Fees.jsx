import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Fees() {
  const [fees, setFees] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await api.get(`/fees/student/${user.id}`);
        setFees(res.data);
      } catch (err) {
        console.error('Failed to fetch fees');
      }
    };
    if (user.role === 'parent' || user.role === 'student') {
      fetchFees();
    }
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Fee Management</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fees.map((f) => (
              <tr key={f.id}>
                <td className="px-6 py-4 whitespace-nowrap">${f.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{f.due_date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    f.status === 'paid' ? 'bg-green-100 text-green-800' :
                    f.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {f.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {f.status !== 'paid' && (
                    <button className="btn btn-primary text-xs">Pay Now</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}