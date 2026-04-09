import { UserRepository } from '../../../domain/repositories/user.repository.js';
import { HashService } from '../../../domain/services/hash.service.js';
import { AppError } from '../../../infrastructure/http/middlewares/error-handler.middleware.js';
import { ResetPasswordDto } from '../../dtos/auth.dto.js';

export class ResetPasswordUseCase {
  constructor(
    private userRepo: UserRepository,
    private hashService: HashService,
  ) {}

  async execute(dto: ResetPasswordDto) {
    const user = await this.userRepo.findByResetToken(dto.token);
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new AppError(400, 'Invalid or expired reset token');
    }

    const hashedPassword = await this.hashService.hash(dto.password);
    await this.userRepo.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });
  }
}
