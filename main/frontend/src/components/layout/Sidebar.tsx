interface Props {
  role: 'ADMIN' | 'ANALYST';
}

export default function Sidebar({ role }: Props) {
  const common = [
    'Dashboard',
    'Incidents',
    'Threat Logs',
  ];

  const adminOnly = [
    'User Management',
    'IP Blocklist',
    'System Settings',
  ];

  const analystOnly = [
    'Assigned Incidents',
    'Investigation Notes',
  ];

  const menu =
    role === 'ADMIN'
      ? [...common, ...adminOnly]
      : [...common, ...analystOnly];

  return (
    <aside className="w-56 bg-black border-r border-gray-800 p-4">
      <nav className="space-y-2">
        {menu.map((item) => (
          <div
            key={item}
            className="px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer transition"
          >
            {item}
          </div>
        ))}
      </nav>
    </aside>
  );
}
