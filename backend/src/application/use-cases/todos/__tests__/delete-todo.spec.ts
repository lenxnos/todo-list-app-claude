import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteTodoUseCase } from '../delete-todo.use-case.js';
import { TodoRepository } from '../../../../domain/repositories/todo.repository.js';
import { AppError } from '../../../../infrastructure/http/middlewares/error-handler.middleware.js';

describe('DeleteTodoUseCase', () => {
  let useCase: DeleteTodoUseCase;
  let todoRepo: TodoRepository;

  beforeEach(() => {
    todoRepo = {
      findByUserId: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new DeleteTodoUseCase(todoRepo);
  });

  it('should delete a todo owned by the user', async () => {
    vi.mocked(todoRepo.findById).mockResolvedValue({
      id: '1', title: 'Test', description: null, completed: false,
      userId: 'user-1', createdAt: new Date(), updatedAt: new Date(),
    });

    await useCase.execute('1', 'user-1');

    expect(todoRepo.delete).toHaveBeenCalledWith('1');
  });

  it('should throw 404 when todo not found', async () => {
    vi.mocked(todoRepo.findById).mockResolvedValue(null);

    await expect(useCase.execute('999', 'user-1'))
      .rejects.toThrow(new AppError(404, 'Todo not found'));
  });
});
