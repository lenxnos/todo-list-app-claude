import { TodoRepository } from '../../domain/repositories/todo.repository.js';
import { Todo } from '../../domain/entities/todo.entity.js';
import prisma from './prisma.client.js';

export class PrismaTodoRepository implements TodoRepository {
  async findByUserId(userId: string, completed?: boolean): Promise<Todo[]> {
    return prisma.todo.findMany({
      where: {
        userId,
        ...(completed !== undefined ? { completed } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Todo | null> {
    return prisma.todo.findUnique({ where: { id } });
  }

  async create(data: { title: string; description?: string; userId: string }): Promise<Todo> {
    return prisma.todo.create({ data });
  }

  async update(id: string, data: Partial<Pick<Todo, 'title' | 'description' | 'completed'>>): Promise<Todo> {
    return prisma.todo.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.todo.delete({ where: { id } });
  }
}
