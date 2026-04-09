import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { createTodoSchema, type CreateTodoFormData } from '../schemas/todo.schema';
import { useCreateTodo } from '../hooks/use-todos';

export function TodoCreateForm() {
  const createMutation = useCreateTodo();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
  });

  const onSubmit = (data: CreateTodoFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
        toast.success('Tarea creada');
      },
      onError: () => {
        toast.error('Error al crear la tarea');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <Input placeholder="Título de la tarea" {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>
        <Button type="submit" disabled={createMutation.isPending}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </div>
      <Input placeholder="Descripción (opcional)" {...register('description')} />
    </form>
  );
}
