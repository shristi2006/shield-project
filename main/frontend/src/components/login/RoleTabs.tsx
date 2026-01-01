type Role = 'ADMIN' | 'ANALYST';

interface RoleTabsProps {
  role: Role;
  setRole: (role: Role) => void;
}

export function RoleTabs({ role, setRole }: RoleTabsProps) {
  return (
    <div className="flex bg-spotify-light-grey rounded-full p-1.5 shadow-inner">
      {(['ANALYST', 'ADMIN'] as const).map((r) => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300
            ${role === r ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
        >
          {r === 'ADMIN' ? 'Admin' : 'Analyst'}
        </button>
      ))}
    </div>
  );
}
