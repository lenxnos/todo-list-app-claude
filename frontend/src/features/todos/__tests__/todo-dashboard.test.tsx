import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/shared/context/auth.context';
import { TodoDashboard } from '../components/todo-dashboard';

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  // Simulate authenticated state
  localStorage.setItem('refreshToken', 'mock');
  localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@test.com' }));

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TodoDashboard />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('TodoDashboard', () => {
  it('renders the create form and loads pending todos', async () => {
    renderDashboard();

    expect(screen.getByPlaceholderText(/título/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });
  });

  it('creates a new todo', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await user.type(screen.getByPlaceholderText(/título/i), 'New task');
    await user.click(screen.getByRole('button', { name: /agregar/i }));

    await waitFor(() => {
      expect(screen.getByText('New task')).toBeInTheDocument();
    });
  });

  it('shows filter to toggle completed', () => {
    renderDashboard();
    expect(screen.getByLabelText(/mostrar finalizados/i)).toBeInTheDocument();
  });
});
