import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateAccount() {
  const [type, setType] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
  const token = router.query.token || localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const response = await fetch('http://localhost:3001/me/accounts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, type }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess('Account created successfully');
    } else {
      setError(data.message || 'Failed to create account');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 bg-opacity-80">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Create Account</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700">Account Type</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g., savings, checking"
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition">
          Create Account
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-500">{success}</p>}
      </form>
    </div>
  );
}
