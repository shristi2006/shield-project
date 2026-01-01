import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface GoogleAuthButtonProps {
  role: 'ADMIN' | 'ANALYST';
}

export const GoogleAuthButton = ({ role }: GoogleAuthButtonProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const endpoint =
    role === 'ADMIN' ? '/auth/login' : '/auth/login';   
return (
  <div className="flex justify-center w-full py-4">
  <div className="hover:scale-105 transition-transform duration-200">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            if (!credentialResponse.credential) {
              toast.error('Google authentication failed');
              return;
            }

            const { data } = await api.post(endpoint, {
              idToken: credentialResponse.credential,
              role,
            });

            login(data.token, data.user);

            navigate(
              data.user.role === 'ADMIN'
                ? '/admin/dashboard'
                : '/analyst/dashboard'
            );
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Authentication failed');
          }
        }}
        onError={() => toast.error('Google authentication failed')}
        theme="filled_black" 
          shape="pill"
      />
    </div>
  </div>
)};
