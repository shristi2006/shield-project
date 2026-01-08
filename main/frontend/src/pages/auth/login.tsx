import { useState } from 'react';
import {RoleTabs} from '../components/login/RoleTabs';
import {Toggle} from '../components/login/Toggle';
import { GoogleAuthButton } from '../components/login/GoogleAuthButton';

export default function LoginPage() {
  const [role, setRole] = useState<'ADMIN' | 'ANALYST'>('ANALYST');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-spotify-light-grey to-spotify-black text-white font-sans">
      <div className="w-full max-w-md px-10 py-12 space-y-10 bg-spotify-black/60 rounded-xl backdrop-blur-sm border border-white/5 shadow-2xl">
        
        {/* Branding */}
        <div className="space-y-2">
          <div className="flex justify-center">
            {/* Replace with a green shield icon if possible */}
            <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(29,185,84,0.4)]">
              <span className="text-black font-black text-xl">S</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-center tracking-tighter">
            S.H.I.E.L.D
          </h1>
          <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
            MicroSOC Command Center
          </p>
        </div>

        <div className="space-y-6">
          <RoleTabs role={role} setRole={setRole} />
          <Toggle mode={mode} setMode={setMode} />
          <div className="pt-4 border-t border-white/10">
            <GoogleAuthButton role={role} />
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-500 font-medium uppercase tracking-widest">
          {mode === 'login'
            ? 'Secure access to your SOC dashboard'
            : 'Create a secure SOC account'}
        </p>
      </div>
    </div>
  );
}