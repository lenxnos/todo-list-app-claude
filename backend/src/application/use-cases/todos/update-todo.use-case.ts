import { TodoRepository } from '../../../domain/repositories/todo.repository.js';
import { AppError } from '../../../infrastructure/http/middlewares/error-handler.middleware.js';
import { UpdateTodoDto } from '../../dtos/todo.dto.js';

export class UpdateTodoUseCase {
  constructor(private todoRepo: TodoRepository) {}

  async execute(id: string, dto: UpdateTodoDto, userId: string) {
    const todo = await this.todoRepo.findById(id);
    if (!todo || todo.userId !== userId) {
      throw new AppError(404, 'Todo not found');
    }

    return this.todoRepo.update(id, dto);
  }
}
