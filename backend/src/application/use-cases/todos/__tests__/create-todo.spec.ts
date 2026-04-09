import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTodoUseCase } from '../create-todo.use-case.js';
import { TodoRepository } from '../../../../domain/repositories/todo.repository.js';

describe('CreateTodoUseCase', () => {
  let useCase: CreateTodoUseCase;
  let todoRepo: TodoRepository;

  beforeEach(() => {
    todoRepo = {
      findByUserId: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new CreateTodoUseCase(todoRepo);
  });

  it('should create a todo', async () => {
    const mockTodo = {
      id: '1', title: 'Test', description: 'Desc', completed: false,
      userId: 'user-1', createdAt: new Date(), updatedAt: new Date(),
    };
    vi.mocked(todoRepo.create).mockResolvedValue(mockTodo);

    const result = await useCase.execute({ title: 'Test', description: 'Desc' }, 'user-1');

    expect(result).toEqual(mockTodo);
    expect(todoRepo.create).toHaveBeenCalledWith({ title: 'Test', description: 'Desc', userId: 'user-1' });
  });
});
