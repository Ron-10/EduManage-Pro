// frontend/src/pages/Library.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/library/books');
        setBooks(res.data);
      } catch (err) {
        console.error('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Library</h1>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-gray-600">by {book.author}</p>
              <p className="text-sm text-gray-500 mt-1">ISBN: {book.isbn}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`text-sm font-medium ${
                  book.available_copies > 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {book.available_copies} of {book.total_copies} available
                </span>
                <button
                  disabled={book.available_copies === 0}
                  className={`btn text-sm ${
                    book.available_copies > 0
                      ? 'btn-primary'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {book.available_copies > 0 ? 'Issue Book' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}