import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { registerRateLimit } from '../middlewares/rate-limit.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema, refreshTokenSchema, requestResetSchema, resetPasswordSchema } from '../../../application/dtos/auth.dto.js';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/register-user.use-case.js';
import { LoginUserUseCase } from '../../../application/use-cases/auth/login-user.use-case.js';
import { RefreshTokenUseCase } from '../../../application/use-cases/auth/refresh-token.use-case.js';
import { RequestPasswordResetUseCase } from '../../../application/use-cases/auth/request-password-reset.use-case.js';
import { ResetPasswordUseCase } from '../../../application/use-cases/auth/reset-password.use-case.js';
import { PrismaUserRepository } from '../../database/prisma-user.repository.js';
import { BcryptHashService } from '../../services/bcrypt-hash.service.js';
import { JwtTokenService } from '../../services/jwt-token.service.js';
import { NodemailerEmailService } from '../../services/nodemailer-email.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export function createAuthRoutes(): Router {
  const router = Router();

  const userRepo = new PrismaUserRepository();
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService();
  const emailService = new NodemailerEmailService();

  const registerUseCase = new RegisterUserUseCase(userRepo, hashService);
  const loginUseCase = new LoginUserUseCase(userRepo, hashService, tokenService);
  const refreshTokenUseCase = new RefreshTokenUseCase(userRepo, tokenService);
  const requestResetUseCase = new RequestPasswordResetUseCase(userRepo, emailService);
  const resetPasswordUseCase = new ResetPasswordUseCase(userRepo, hashService);

  const controller = new AuthController(
    registerUseCase,
    loginUseCase,
    refreshTokenUseCase,
    requestResetUseCase,
    resetPasswordUseCase,
  );

  router.post('/register', registerRateLimit, validate(registerSchema), controller.register);
  router.post('/login', validate(loginSchema), controller.login);
  router.post('/refresh', validate(refreshTokenSchema), controller.refresh);
  router.post('/logout', authMiddleware(tokenService), controller.logout);
  router.post('/request-reset', validate(requestResetSchema), controller.requestReset);
  router.post('/reset-password', validate(resetPasswordSchema), controller.resetPassword);

  return router;
}
