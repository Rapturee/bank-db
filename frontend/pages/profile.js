import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [error, setError] = useState(null);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!token) {
      setError('No token provided');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3001/me/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setProfile(data);
        } else {
          setError(data.message || 'Something went wrong');
        }
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 bg-opacity-80">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Profile</h1>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-xl mb-4">Username: {profile.username}</p>
            <p className="text-xl mb-4">Email: {profile.email}</p>
          </>
        )}
      </div>
    </div>
  );
}
