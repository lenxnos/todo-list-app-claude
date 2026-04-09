import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResetPasswordUseCase } from '../reset-password.use-case.js';
import { UserRepository } from '../../../../domain/repositories/user.repository.js';
import { HashService } from '../../../../domain/services/hash.service.js';
import { AppError } from '../../../../infrastructure/http/middlewares/error-handler.middleware.js';

describe('ResetPasswordUseCase', () => {
  let useCase: ResetPasswordUseCase;
  let userRepo: UserRepository;
  let hashService: HashService;

  beforeEach(() => {
    userRepo = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      findByResetToken: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };
    hashService = { hash: vi.fn(), compare: vi.fn() };
    useCase = new ResetPasswordUseCase(userRepo, hashService);
  });

  it('should reset password with valid token', async () => {
    vi.mocked(userRepo.findByResetToken).mockResolvedValue({
      id: '1', email: 'test@test.com', password: 'old-pw',
      refreshToken: null, resetToken: 'valid-token',
      resetTokenExpiry: new Date(Date.now() + 3600000),
      createdAt: new Date(), updatedAt: new Date(),
    });
    vi.mocked(hashService.hash).mockResolvedValue('new-hashed-pw');

    await useCase.execute({ token: 'valid-token', password: 'newpass' });

    expect(userRepo.update).toHaveBeenCalledWith('1', {
      password: 'new-hashed-pw',
      resetToken: null,
      resetTokenExpiry: null,
    });
  });

  it('should throw 400 when token is invalid', async () => {
    vi.mocked(userRepo.findByResetToken).mockResolvedValue(null);

    await expect(useCase.execute({ token: 'bad', password: 'newpass' }))
      .rejects.toThrow(new AppError(400, 'Invalid or expired reset token'));
  });

  it('should throw 400 when token is expired', async () => {
    vi.mocked(userRepo.findByResetToken).mockResolvedValue({
      id: '1', email: 'test@test.com', password: 'pw',
      refreshToken: null, resetToken: 'expired',
      resetTokenExpiry: new Date(Date.now() - 1000),
      createdAt: new Date(), updatedAt: new Date(),
    });

    await expect(useCase.execute({ token: 'expired', password: 'newpass' }))
      .rejects.toThrow(new AppError(400, 'Invalid or expired reset token'));
  });
});
