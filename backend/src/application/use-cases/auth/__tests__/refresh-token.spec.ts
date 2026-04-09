import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RefreshTokenUseCase } from '../refresh-token.use-case.js';
import { UserRepository } from '../../../../domain/repositories/user.repository.js';
import { TokenService } from '../../../../domain/services/token.service.js';
import { AppError } from '../../../../infrastructure/http/middlewares/error-handler.middleware.js';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let userRepo: UserRepository;
  let tokenService: TokenService;

  beforeEach(() => {
    userRepo = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      findByResetToken: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };
    tokenService = {
      generateAccessToken: vi.fn().mockReturnValue('new-access'),
      generateRefreshToken: vi.fn().mockReturnValue('new-refresh'),
      verifyAccessToken: vi.fn(),
      verifyRefreshToken: vi.fn().mockReturnValue({ id: '1' }),
    };
    useCase = new RefreshTokenUseCase(userRepo, tokenService);
  });

  it('should rotate tokens on valid refresh', async () => {
    vi.mocked(userRepo.findById).mockResolvedValue({
      id: '1', email: 'test@test.com', password: 'pw',
      refreshToken: 'old-refresh', resetToken: null, resetTokenExpiry: null,
      createdAt: new Date(), updatedAt: new Date(),
    });

    const result = await useCase.execute({ refreshToken: 'old-refresh' });

    expect(result.accessToken).toBe('new-access');
    expect(result.refreshToken).toBe('new-refresh');
    expect(userRepo.update).toHaveBeenCalledWith('1', { refreshToken: 'new-refresh' });
  });

  it('should throw 401 when refresh token is invalid', async () => {
    vi.mocked(tokenService.verifyRefreshToken).mockImplementation(() => { throw new Error(); });

    await expect(useCase.execute({ refreshToken: 'bad-token' }))
      .rejects.toThrow(new AppError(401, 'Invalid refresh token'));
  });

  it('should throw 401 when stored token does not match', async () => {
    vi.mocked(userRepo.findById).mockResolvedValue({
      id: '1', email: 'test@test.com', password: 'pw',
      refreshToken: 'different-token', resetToken: null, resetTokenExpiry: null,
      createdAt: new Date(), updatedAt: new Date(),
    });

    await expect(useCase.execute({ refreshToken: 'old-refresh' }))
      .rejects.toThrow(new AppError(401, 'Invalid refresh token'));
  });
});
