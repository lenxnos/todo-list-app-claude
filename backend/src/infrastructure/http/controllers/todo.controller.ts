import { Response, NextFunction } from 'express';
import { CreateTodoUseCase } from '../../../application/use-cases/todos/create-todo.use-case.js';
import { GetTodosUseCase } from '../../../application/use-cases/todos/get-todos.use-case.js';
import { UpdateTodoUseCase } from '../../../application/use-cases/todos/update-todo.use-case.js';
import { DeleteTodoUseCase } from '../../../application/use-cases/todos/delete-todo.use-case.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export class TodoController {
  constructor(
    private createTodoUseCase: CreateTodoUseCase,
    private getTodosUseCase: GetTodosUseCase,
    private updateTodoUseCase: UpdateTodoUseCase,
    private deleteTodoUseCase: DeleteTodoUseCase,
  ) {}

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const todo = await this.createTodoUseCase.execute(req.body, req.userId!);
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const completedParam = req.query.completed as string | undefined;
      const completed = completedParam === 'true' ? true : completedParam === 'false' ? false : undefined;
      const todos = await this.getTodosUseCase.execute(req.userId!, completed);
      res.json(todos);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const todo = await this.updateTodoUseCase.execute(id, req.body, req.userId!);
      res.json(todo);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await this.deleteTodoUseCase.execute(id, req.userId!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
