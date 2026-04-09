import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(255, 'Título muy largo'),
  description: z.string().optional(),
});

export type CreateTodoFormData = z.infer<typeof createTodoSchema>;
