// frontend/src/pages/Messages.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ receiver_id: '', subject: '', body: '' });
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const msgRes = await api.get('/messages');
        setMessages(msgRes.data);

        // Mock user list (in real app, fetch from /users endpoint)
        setUsers([
          { id: '2', name: 'Principal Amina' },
          { id: '3', name: 'Teacher James' },
          { id: '4', name: 'Parent Linda' },
        ]);
      } catch (err) {
        console.error('Failed to load messages');
      }
    };
    fetchData();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await api.post('/messages', newMessage);
      setNewMessage({ receiver_id: '', subject: '', body: '' });
      // Refresh messages
      const res = await api.get('/messages');
      setMessages(res.data);
    } catch (err) {
      alert('Failed to send message');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      {/* Compose Message */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Send Message</h2>
        <form onSubmit={handleSend} className="space-y-4">
          <select
            value={newMessage.receiver_id}
            onChange={(e) => setNewMessage({ ...newMessage, receiver_id: e.target.value })}
            className="input w-full"
            required
          >
            <option value="">Select Recipient</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Subject"
            value={newMessage.subject}
            onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
            className="input w-full"
            required
          />
          <textarea
            placeholder="Type your message..."
            value={newMessage.body}
            onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
            className="input w-full h-32"
            required
          />
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
      </div>

      {/* Inbox */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Inbox</h2>
        <ul className="divide-y divide-gray-200">
          {messages.length === 0 ? (
            <li className="p-6 text-gray-500">No messages yet.</li>
          ) : (
            messages.map((msg) => (
              <li key={msg.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between">
                  <strong>{msg.sender_name}</strong>
                  <span className="text-sm text-gray-500">{new Date(msg.sent_at).toLocaleDateString()}</span>
                </div>
                <div className="font-medium mt-1">{msg.subject}</div>
                <p className="text-gray-700 mt-2">{msg.body}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}