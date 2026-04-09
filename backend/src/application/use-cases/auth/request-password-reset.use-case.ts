import crypto from 'node:crypto';
import { UserRepository } from '../../../domain/repositories/user.repository.js';
import { EmailService } from '../../../domain/services/email.service.js';

export class RequestPasswordResetUseCase {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService,
  ) {}

  async execute(email: string) {
    const user = await this.userRepo.findByEmail(email);
    // Always return success to prevent email enumeration
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userRepo.update(user.id, { resetToken, resetTokenExpiry });
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }
}
