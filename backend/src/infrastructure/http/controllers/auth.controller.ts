import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/register-user.use-case.js';
import { LoginUserUseCase } from '../../../application/use-cases/auth/login-user.use-case.js';
import { RefreshTokenUseCase } from '../../../application/use-cases/auth/refresh-token.use-case.js';
import { RequestPasswordResetUseCase } from '../../../application/use-cases/auth/request-password-reset.use-case.js';
import { ResetPasswordUseCase } from '../../../application/use-cases/auth/reset-password.use-case.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUserUseCase,
    private loginUseCase: LoginUserUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private requestResetUseCase: RequestPasswordResetUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.registerUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.refreshTokenUseCase.execute(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Clear the refresh token from the database - handled by update
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  requestReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.requestResetUseCase.execute(req.body.email);
      res.json({ message: 'If the email exists, a reset link has been sent.' });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.resetPasswordUseCase.execute(req.body);
      res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
      next(error);
    }
  };
}
