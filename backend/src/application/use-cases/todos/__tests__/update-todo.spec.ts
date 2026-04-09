import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTodoUseCase } from '../update-todo.use-case.js';
import { TodoRepository } from '../../../../domain/repositories/todo.repository.js';
import { AppError } from '../../../../infrastructure/http/middlewares/error-handler.middleware.js';

describe('UpdateTodoUseCase', () => {
  let useCase: UpdateTodoUseCase;
  let todoRepo: TodoRepository;

  const mockTodo = {
    id: '1', title: 'Test', description: null, completed: false,
    userId: 'user-1', createdAt: new Date(), updatedAt: new Date(),
  };

  beforeEach(() => {
    todoRepo = {
      findByUserId: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new UpdateTodoUseCase(todoRepo);
  });

  it('should update a todo owned by the user', async () => {
    vi.mocked(todoRepo.findById).mockResolvedValue(mockTodo);
    vi.mocked(todoRepo.update).mockResolvedValue({ ...mockTodo, completed: true });

    const result = await useCase.execute('1', { completed: true }, 'user-1');

    expect(result.completed).toBe(true);
  });

  it('should throw 404 when todo not found', async () => {
    vi.mocked(todoRepo.findById).mockResolvedValue(null);

    await expect(useCase.execute('999', { completed: true }, 'user-1'))
      .rejects.toThrow(new AppError(404, 'Todo not found'));
  });

  it('should throw 404 when user does not own the todo', async () => {
    vi.mocked(todoRepo.findById).mockResolvedValue(mockTodo);

    await expect(useCase.execute('1', { completed: true }, 'other-user'))
      .rejects.toThrow(new AppError(404, 'Todo not found'));
  });
});
