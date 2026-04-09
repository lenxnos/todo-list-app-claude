import { TodoRepository } from '../../../domain/repositories/todo.repository.js';

export class GetTodosUseCase {
  constructor(private todoRepo: TodoRepository) {}

  async execute(userId: string, completed?: boolean) {
    return this.todoRepo.findByUserId(userId, completed);
  }
}
