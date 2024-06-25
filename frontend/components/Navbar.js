import Link from 'next/link';

export default function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-lg">
          <Link href="/" legacyBehavior>
            <a>Bank</a>
          </Link>
        </div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/profile" legacyBehavior>
                <a className="text-white hover:text-gray-400">Profile</a>
              </Link>
              <Link href="/transactions" legacyBehavior>
                <a className="text-white hover:text-gray-400">Transactions</a>
              </Link>
              <Link href="/transfer" legacyBehavior>
                <a className="text-white hover:text-gray-400">Transfer</a>
              </Link>
              <Link href="/createAccount" legacyBehavior>
                <a className="text-white hover:text-gray-400">Create Account</a>
              </Link>
              <button onClick={onLogout} className="text-white hover:text-gray-400">Logout</button>
            </>
          ) : (
            <>
              <Link href="/createUser" legacyBehavior>
                <a className="text-white hover:text-gray-400">Create User</a>
              </Link>
              <Link href="/login" legacyBehavior>
                <a className="text-white hover:text-gray-400">Login</a>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
