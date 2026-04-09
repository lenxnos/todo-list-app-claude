import { useRef, useCallback, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/shared/ui/checkbox';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Todo } from '@/shared/types/todo';
import { useUpdateTodo, useDeleteTodo } from '../hooks/use-todos';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();
  const undoneRef = useRef(false);
  const [hidden, setHidden] = useState(false);

  const handleToggle = useCallback(() => {
    if (!todo.completed) {
      undoneRef.current = false;
      setHidden(true);

      toast('Tarea completada', {
        description: todo.title,
        action: {
          label: 'Deshacer',
          onClick: () => {
            undoneRef.current = true;
            setHidden(false);
          },
        },
        duration: 5000,
        onAutoClose: () => {
          if (!undoneRef.current) {
            updateMutation.mutate({ id: todo.id, data: { completed: true } });
          }
        },
        onDismiss: () => {
          if (!undoneRef.current) {
            updateMutation.mutate({ id: todo.id, data: { completed: true } });
          }
        },
      });
    } else {
      updateMutation.mutate({ id: todo.id, data: { completed: false } });
    }
  }, [todo, updateMutation]);

  const handleDelete = useCallback(() => {
    deleteMutation.mutate(todo.id, {
      onError: () => {
        toast.error('Error al eliminar la tarea');
      },
    });
  }, [todo.id, deleteMutation]);

  if (hidden) return null;

  return (
    <Card className="p-4 flex items-start gap-3">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className={`text-sm mt-1 ${todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
            {todo.description}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
        className="text-muted-foreground hover:text-destructive shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  );
}
