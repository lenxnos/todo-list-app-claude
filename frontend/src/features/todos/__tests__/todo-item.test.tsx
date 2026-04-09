import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TodoItem } from '../components/todo-item';

function renderTodoItem(overrides = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const todo = {
    id: '1',
    title: 'Test todo',
    description: 'A description',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TodoItem todo={todo} />
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('TodoItem', () => {
  it('renders title and description', () => {
    renderTodoItem();
    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(screen.getByText('A description')).toBeInTheDocument();
  });

  it('renders a checkbox', () => {
    renderTodoItem();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders a delete button', () => {
    renderTodoItem();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies line-through style when completed', () => {
    renderTodoItem({ completed: true });
    const title = screen.getByText('Test todo');
    expect(title.className).toContain('line-through');
  });
});
