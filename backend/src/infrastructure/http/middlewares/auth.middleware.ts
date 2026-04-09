import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../../domain/services/token.service.js';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(tokenService: TokenService) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = tokenService.verifyAccessToken(token);
      req.userId = payload.id;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired access token' });
    }
  };
}
