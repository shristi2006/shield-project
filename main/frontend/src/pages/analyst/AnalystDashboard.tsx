import TopBar from '../../components/layout/Topbar';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AnalystDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <TopBar />

      <div className="flex">
        <Sidebar role="ANALYST" />

        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold">
            Analyst Dashboard
          </h1>

          <p className="text-gray-400">
            Welcome, {user?.name || 'Analyst'}.
            Monitor, investigate, and respond to security incidents.
          </p>

          {/* Placeholder cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-sm text-gray-400">Open Incidents</h3>
              <p className="text-3xl font-bold mt-2">12</p>
            </div>

            <div className="bg-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-sm text-gray-400">Assigned to You</h3>
              <p className="text-3xl font-bold mt-2">5</p>
            </div>

            <div className="bg-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-sm text-gray-400">Alerts Today</h3>
              <p className="text-3xl font-bold mt-2">27</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
