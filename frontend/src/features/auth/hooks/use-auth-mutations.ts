import { useMutation } from '@tanstack/react-query';
import apiClient from '@/shared/api/api-client';
import { useAuth } from '@/shared/context/auth.context';
import { AuthResponse } from '@/shared/types/user';
import { LoginFormData, RegisterFormData, ForgotPasswordFormData, ResetPasswordFormData } from '../schemas/auth.schema';

export function useLoginMutation() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await apiClient.post<AuthResponse>('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      login(data);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const res = await apiClient.post('/auth/register', {
        email: data.email,
        password: data.password,
      });
      return res.data;
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const res = await apiClient.post('/auth/request-reset', data);
      return res.data;
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async ({ token, data }: { token: string; data: ResetPasswordFormData }) => {
      const res = await apiClient.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      return res.data;
    },
  });
}
