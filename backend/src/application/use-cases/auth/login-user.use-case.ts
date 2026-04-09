import { UserRepository } from '../../../domain/repositories/user.repository.js';
import { HashService } from '../../../domain/services/hash.service.js';
import { TokenService } from '../../../domain/services/token.service.js';
import { AppError } from '../../../infrastructure/http/middlewares/error-handler.middleware.js';
import { LoginDto } from '../../dtos/auth.dto.js';

export class LoginUserUseCase {
  constructor(
    private userRepo: UserRepository,
    private hashService: HashService,
    private tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const valid = await this.hashService.compare(dto.password, user.password);
    if (!valid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const accessToken = this.tokenService.generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = this.tokenService.generateRefreshToken({ id: user.id });

    await this.userRepo.update(user.id, { refreshToken });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email },
    };
  }
}
