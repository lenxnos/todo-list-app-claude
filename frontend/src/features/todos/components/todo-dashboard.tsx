import { useState } from 'react';
import { TodoCreateForm } from './todo-create-form';
import { TodoFilters } from './todo-filters';
import { TodoItem } from './todo-item';
import { useTodos } from '../hooks/use-todos';

export function TodoDashboard() {
  const [showCompleted, setShowCompleted] = useState(false);
  const { data: todos, isLoading, error } = useTodos(showCompleted);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <TodoCreateForm />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {showCompleted ? 'Tareas finalizadas' : 'Tareas pendientes'}
        </h2>
        <TodoFilters showCompleted={showCompleted} onShowCompletedChange={setShowCompleted} />
      </div>

      {isLoading && (
        <p className="text-center text-muted-foreground">Cargando tareas...</p>
      )}

      {error && (
        <p className="text-center text-destructive">Error al cargar las tareas</p>
      )}

      {todos && todos.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          {showCompleted ? 'No hay tareas finalizadas' : 'No hay tareas pendientes. Crea una nueva.'}
        </p>
      )}

      <div className="space-y-3">
        {todos?.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
