import { Todo } from '../entities/todo.entity.js';

export interface TodoRepository {
  findByUserId(userId: string, completed?: boolean): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(data: { title: string; description?: string; userId: string }): Promise<Todo>;
  update(id: string, data: Partial<Pick<Todo, 'title' | 'description' | 'completed'>>): Promise<Todo>;
  delete(id: string): Promise<void>;
}
