export interface TokenPayload {
  id: string;
  email: string;
}

export interface TokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: { id: string }): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): { id: string };
}
