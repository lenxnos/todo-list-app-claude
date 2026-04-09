import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/api/api-client';
import { Todo } from '@/shared/types/todo';
import { CreateTodoFormData } from '../schemas/todo.schema';

export function useTodos(showCompleted: boolean) {
  return useQuery<Todo[]>({
    queryKey: ['todos', { completed: showCompleted }],
    queryFn: async () => {
      const res = await apiClient.get('/todos', {
        params: { completed: showCompleted },
      });
      return res.data;
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTodoFormData) => {
      const res = await apiClient.post<Todo>('/todos', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Pick<Todo, 'title' | 'description' | 'completed'>> }) => {
      const res = await apiClient.put<Todo>(`/todos/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
