type Mode = 'login' | 'signup';

interface ToggleProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export function Toggle({ mode, setMode }: ToggleProps) {
  return (
    <div className="flex justify-center gap-8 text-sm font-bold">
      {(['login', 'signup'] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`pb-2 transition-all duration-200 uppercase tracking-widest text-xs
            ${mode === m ? 'text-brand border-b-2 border-brand' : 'text-gray-400 hover:text-white'}`}
        >
          {m === 'login' ? 'Log in' : 'Sign up'}
        </button>
      ))}
    </div>
  );
}
