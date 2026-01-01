import TopBar from '../../components/layout/Topbar';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <TopBar />

      <div className="flex">
        <Sidebar role="ADMIN" />

        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold">
            Admin Dashboard
          </h1>

          <p className="text-gray-400">
            Welcome, {user?.name || 'Admin'}.
            Manage users, policies, and system defenses.
          </p>

          {/* Placeholder cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-sm text-gray-400">Total Users</h3>
              <p className="text-3xl font-bold mt-2">48</p>
            </div>

            <div className="bg-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-sm text-gray-400">Active Incidents</h3>
              <p className="text-3xl font-bold mt-2">19</p>
            </div>

            <div className="bg-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-sm text-gray-400">Blocked IPs</h3>
              <p className="text-3xl font-bold mt-2">103</p>
            </div>

            <div className="bg-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-sm text-gray-400">System Health</h3>
              <p className="text-xl font-semibold mt-2 text-green-400">
                Stable
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
