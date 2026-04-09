export interface EmailService {
  sendPasswordResetEmail(to: string, resetToken: string): Promise<void>;
}
