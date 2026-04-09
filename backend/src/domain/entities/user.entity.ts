export interface User {
  id: string;
  email: string;
  password: string;
  refreshToken: string | null;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
