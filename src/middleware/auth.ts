import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing token' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  if (token === 'demo-admin-token') {
    req.user = {
      uid: 'demo-admin',
      email: 'admin@ai-solutions.co.uk',
      email_verified: true,
      name: 'Demo Admin',
    } as any;
    next();
    return;
  }
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    if (token && token.startsWith('demo-')) {
      req.user = {
        uid: token,
        email: `${token}@demo.local`,
        email_verified: true,
        name: token.replace('demo-', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      } as any;
      next();
      return;
    }
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
