import { TodoRepository } from '../../../domain/repositories/todo.repository.js';
import { CreateTodoDto } from '../../dtos/todo.dto.js';

export class CreateTodoUseCase {
  constructor(private todoRepo: TodoRepository) {}

  async execute(dto: CreateTodoDto, userId: string) {
    return this.todoRepo.create({
      title: dto.title,
      description: dto.description,
      userId,
    });
  }
}
