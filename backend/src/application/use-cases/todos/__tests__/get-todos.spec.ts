import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTodosUseCase } from '../get-todos.use-case.js';
import { TodoRepository } from '../../../../domain/repositories/todo.repository.js';

describe('GetTodosUseCase', () => {
  let useCase: GetTodosUseCase;
  let todoRepo: TodoRepository;

  beforeEach(() => {
    todoRepo = {
      findByUserId: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new GetTodosUseCase(todoRepo);
  });

  it('should return todos for user', async () => {
    const todos = [
      { id: '1', title: 'Test', description: null, completed: false, userId: 'u1', createdAt: new Date(), updatedAt: new Date() },
    ];
    vi.mocked(todoRepo.findByUserId).mockResolvedValue(todos);

    const result = await useCase.execute('u1', false);

    expect(result).toEqual(todos);
    expect(todoRepo.findByUserId).toHaveBeenCalledWith('u1', false);
  });
});
