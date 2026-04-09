import { TodoRepository } from '../../../domain/repositories/todo.repository.js';
import { AppError } from '../../../infrastructure/http/middlewares/error-handler.middleware.js';

export class DeleteTodoUseCase {
  constructor(private todoRepo: TodoRepository) {}

  async execute(id: string, userId: string) {
    const todo = await this.todoRepo.findById(id);
    if (!todo || todo.userId !== userId) {
      throw new AppError(404, 'Todo not found');
    }

    await this.todoRepo.delete(id);
  }
}
