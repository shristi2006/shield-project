import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface GoogleUserPayload {
  email: string;
  name?: string;
  avatar?: string;
}

 export const verifyGoogleToken = async (idToken: string) => {
  console.log('ID TOKEN RECEIVED:', idToken.slice(0, 20));

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  console.log('GOOGLE PAYLOAD:', payload);

  if (!payload?.email) {
    throw new Error('Invalid Google token');
  }

  return {
    email: payload.email,
    name: payload.name,
    avatar: payload.picture,
  };
};
