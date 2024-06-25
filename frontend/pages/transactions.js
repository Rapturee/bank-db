import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch('http://localhost:3001/me/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setTransactions(data);
      } else {
        setError(data.message || 'Something went wrong');
      }
    };

    if (token) {
      fetchTransactions();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 bg-opacity-80">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Transactions</h1>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id} className="mb-4">
                {transaction.description}: ${transaction.amount}
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found</p>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
