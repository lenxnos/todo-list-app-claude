import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUserUseCase } from '../register-user.use-case.js';
import { UserRepository } from '../../../../domain/repositories/user.repository.js';
import { HashService } from '../../../../domain/services/hash.service.js';
import { AppError } from '../../../../infrastructure/http/middlewares/error-handler.middleware.js';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
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
    hashService = {
      hash: vi.fn(),
      compare: vi.fn(),
    };
    useCase = new RegisterUserUseCase(userRepo, hashService);
  });

  it('should create a user when email is available', async () => {
    vi.mocked(userRepo.findByEmail).mockResolvedValue(null);
    vi.mocked(hashService.hash).mockResolvedValue('hashed-pw');
    vi.mocked(userRepo.create).mockResolvedValue({
      id: '1', email: 'test@test.com', password: 'hashed-pw',
      refreshToken: null, resetToken: null, resetTokenExpiry: null,
      createdAt: new Date(), updatedAt: new Date(),
    });

    const result = await useCase.execute({ email: 'test@test.com', password: '123456' });

    expect(result.email).toBe('test@test.com');
    expect(hashService.hash).toHaveBeenCalledWith('123456');
    expect(userRepo.create).toHaveBeenCalledWith({ email: 'test@test.com', password: 'hashed-pw' });
  });

  it('should throw 409 when email is taken', async () => {
    vi.mocked(userRepo.findByEmail).mockResolvedValue({
      id: '1', email: 'test@test.com', password: 'pw',
      refreshToken: null, resetToken: null, resetTokenExpiry: null,
      createdAt: new Date(), updatedAt: new Date(),
    });

    await expect(useCase.execute({ email: 'test@test.com', password: '123456' }))
      .rejects.toThrow(new AppError(409, 'Email already registered'));
  });
});
