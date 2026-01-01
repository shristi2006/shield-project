import { useAuth } from '../../context/AuthContext';

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-black border-b border-gray-800 flex items-center justify-between px-6">
      <span className="font-semibold text-white">
        S.H.I.E.L.D MicroSOC
      </span>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          {user?.role}
        </span>
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
