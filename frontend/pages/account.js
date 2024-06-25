import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Account() {
  const [amount, setAmount] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    const fetchBalance = async () => {
      const response = await fetch('http://localhost:3001/me/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setAmount(data.amount);
      } else {
        setError(data.message || 'Something went wrong');
      }
    };

    if (token) {
      fetchBalance();
    }
  }, [token]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError(null);

    const response = await fetch('http://localhost:3001/me/accounts/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, amount: parseInt(deposit) }),
    });

    const data = await response.json();

    if (response.ok) {
      setAmount(data.amount);
    } else {
      setError(data.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Account</h1>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <p className="text-xl mb-4">Balance: ${amount}</p>
        <form onSubmit={handleDeposit}>
          <input
            type="number"
            placeholder="Deposit Amount"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition">Deposit</button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
