import { UserRepository } from '../../../domain/repositories/user.repository.js';
import { TokenService } from '../../../domain/services/token.service.js';
import { AppError } from '../../../infrastructure/http/middlewares/error-handler.middleware.js';
import { RefreshTokenDto } from '../../dtos/auth.dto.js';

export class RefreshTokenUseCase {
  constructor(
    private userRepo: UserRepository,
    private tokenService: TokenService,
  ) {}

  async execute(dto: RefreshTokenDto) {
    let payload: { id: string };
    try {
      payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
    } catch {
      throw new AppError(401, 'Invalid refresh token');
    }

    const user = await this.userRepo.findById(payload.id);
    if (!user || user.refreshToken !== dto.refreshToken) {
      throw new AppError(401, 'Invalid refresh token');
    }

    const accessToken = this.tokenService.generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = this.tokenService.generateRefreshToken({ id: user.id });

    await this.userRepo.update(user.id, { refreshToken });

    return { accessToken, refreshToken };
  }
}
