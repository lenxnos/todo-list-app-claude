import { User } from '../entities/user.entity.js';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByResetToken(token: string): Promise<User | null>;
  create(data: { email: string; password: string }): Promise<User>;
  update(id: string, data: Partial<Pick<User, 'password' | 'refreshToken' | 'resetToken' | 'resetTokenExpiry'>>): Promise<User>;
}
