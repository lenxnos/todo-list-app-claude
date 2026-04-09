import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RequestPasswordResetUseCase } from '../request-password-reset.use-case.js';
import { UserRepository } from '../../../../domain/repositories/user.repository.js';
import { EmailService } from '../../../../domain/services/email.service.js';

describe('RequestPasswordResetUseCase', () => {
  let useCase: RequestPasswordResetUseCase;
  let userRepo: UserRepository;
  let emailService: EmailService;

  beforeEach(() => {
    userRepo = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      findByResetToken: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };
    emailService = { sendPasswordResetEmail: vi.fn() };
    useCase = new RequestPasswordResetUseCase(userRepo, emailService);
  });

  it('should send reset email when user exists', async () => {
    vi.mocked(userRepo.findByEmail).mockResolvedValue({
      id: '1', email: 'test@test.com', password: 'pw',
      refreshToken: null, resetToken: null, resetTokenExpiry: null,
      createdAt: new Date(), updatedAt: new Date(),
    });

    await useCase.execute('test@test.com');

    expect(userRepo.update).toHaveBeenCalledWith('1', expect.objectContaining({
      resetToken: expect.any(String),
      resetTokenExpiry: expect.any(Date),
    }));
    expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith('test@test.com', expect.any(String));
  });

  it('should silently succeed when user does not exist', async () => {
    vi.mocked(userRepo.findByEmail).mockResolvedValue(null);

    await useCase.execute('nobody@test.com');

    expect(userRepo.update).not.toHaveBeenCalled();
    expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });
});
