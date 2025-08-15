import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Students Enrolled',
        data: [120, 135, 140, 150, 160, 175],
        backgroundColor: '#3B82F6',
      },
      {
        label: 'Fees Collected ($)',
        data: [8000, 9500, 11000, 10500, 12000, 13500],
        backgroundColor: '#10B981',
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Students</h2>
          <p className="text-3xl font-bold text-primary">842</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Fees Collected</h2>
          <p className="text-3xl font-bold text-secondary">\$94,200</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Attendance Rate</h2>
          <p className="text-3xl font-bold text-blue-600">96.4%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Enrollment & Revenue</h2>
        <Bar data={barData} options={{ responsive: true }} />
      </div>
    </div>
  );
}