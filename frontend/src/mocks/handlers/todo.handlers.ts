import { http, HttpResponse } from 'msw';
import { Todo } from '@/shared/types/todo';

let todos: Todo[] = [
  {
    id: '1',
    title: 'Test todo',
    description: 'A test description',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Completed todo',
    description: null,
    completed: true,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

export const todoHandlers = [
  http.get('/api/todos', ({ request }) => {
    const url = new URL(request.url);
    const completed = url.searchParams.get('completed');

    let filtered = todos;
    if (completed === 'true') {
      filtered = todos.filter((t) => t.completed);
    } else if (completed === 'false') {
      filtered = todos.filter((t) => !t.completed);
    }

    return HttpResponse.json(filtered);
  }),

  http.post('/api/todos', async ({ request }) => {
    const body = await request.json() as { title: string; description?: string };
    const newTodo: Todo = {
      id: String(todos.length + 1),
      title: body.title,
      description: body.description || null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    todos.push(newTodo);
    return HttpResponse.json(newTodo, { status: 201 });
  }),

  http.put('/api/todos/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as Partial<Todo>;
    const index = todos.findIndex((t) => t.id === id);

    if (index === -1) {
      return HttpResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    todos[index] = { ...todos[index]!, ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(todos[index]);
  }),

  http.delete('/api/todos/:id', ({ params }) => {
    const { id } = params;
    todos = todos.filter((t) => t.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
