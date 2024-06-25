import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 bg-opacity-80">
      <div className="container">
        <h1 className="text-5xl font-bold text-gray-800 mb-8">Welcome to the Bank</h1>
        <nav className="flex space-x-4">
          <Link href="/createUser" legacyBehavior>
            <a className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition">Create User</a>
          </Link>
          <Link href="/login" legacyBehavior>
            <a className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition">Login</a>
          </Link>
        </nav>
      </div>
    </div>
  );
}
