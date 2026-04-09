import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUserUseCase } from '../login-user.use-case.js';
import { UserRepository } from '../../../../domain/repositories/user.repository.js';
import { HashService } from '../../../../domain/services/hash.service.js';
import { TokenService } from '../../../../domain/services/token.service.js';
import { AppError } from '../../../../infrastructure/http/middlewares/error-handler.middleware.js';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let userRepo: UserRepository;
  let hashService: HashService;
  let tokenService: TokenService;

  const mockUser = {
    id: '1', email: 'test@test.com', password: 'hashed-pw',
    refreshToken: null, resetToken: null, resetTokenExpiry: null,
    createdAt: new Date(), updatedAt: new Date(),
  };

  beforeEach(() => {
    userRepo = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      findByResetToken: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };
    hashService = { hash: vi.fn(), compare: vi.fn() };
    tokenService = {
      generateAccessToken: vi.fn().mockReturnValue('access-token'),
      generateRefreshToken: vi.fn().mockReturnValue('refresh-token'),
      verifyAccessToken: vi.fn(),
      verifyRefreshToken: vi.fn(),
    };
    useCase = new LoginUserUseCase(userRepo, hashService, tokenService);
  });

  it('should return tokens on valid credentials', async () => {
    vi.mocked(userRepo.findByEmail).mockResolvedValue(mockUser);
    vi.mocked(hashService.compare).mockResolvedValue(true);

    const result = await useCase.execute({ email: 'test@test.com', password: '123456' });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user.email).toBe('test@test.com');
    expect(userRepo.update).toHaveBeenCalledWith('1', { refreshToken: 'refresh-token' });
  });

  it('should throw 401 when user not found', async () => {
    vi.mocked(userRepo.findByEmail).mockResolvedValue(null);

    await expect(useCase.execute({ email: 'nope@test.com', password: '123456' }))
      .rejects.toThrow(new AppError(401, 'Invalid email or password'));
  });

  it('should throw 401 when password is wrong', async () => {
    vi.mocked(userRepo.findByEmail).mockResolvedValue(mockUser);
    vi.mocked(hashService.compare).mockResolvedValue(false);

    await expect(useCase.execute({ email: 'test@test.com', password: 'wrong' }))
      .rejects.toThrow(new AppError(401, 'Invalid email or password'));
  });
});
