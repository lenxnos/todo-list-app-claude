import { UserRepository } from '../../../domain/repositories/user.repository.js';
import { HashService } from '../../../domain/services/hash.service.js';
import { AppError } from '../../../infrastructure/http/middlewares/error-handler.middleware.js';
import { RegisterDto } from '../../dtos/auth.dto.js';

export class RegisterUserUseCase {
  constructor(
    private userRepo: UserRepository,
    private hashService: HashService,
  ) {}

  async execute(dto: RegisterDto) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await this.hashService.hash(dto.password);
    const user = await this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
    });

    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }
}
