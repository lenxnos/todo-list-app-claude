import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createTodoSchema, updateTodoSchema } from '../../../application/dtos/todo.dto.js';
import { CreateTodoUseCase } from '../../../application/use-cases/todos/create-todo.use-case.js';
import { GetTodosUseCase } from '../../../application/use-cases/todos/get-todos.use-case.js';
import { UpdateTodoUseCase } from '../../../application/use-cases/todos/update-todo.use-case.js';
import { DeleteTodoUseCase } from '../../../application/use-cases/todos/delete-todo.use-case.js';
import { PrismaTodoRepository } from '../../database/prisma-todo.repository.js';
import { JwtTokenService } from '../../services/jwt-token.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export function createTodoRoutes(): Router {
  const router = Router();

  const todoRepo = new PrismaTodoRepository();
  const tokenService = new JwtTokenService();

  const createTodo = new CreateTodoUseCase(todoRepo);
  const getTodos = new GetTodosUseCase(todoRepo);
  const updateTodo = new UpdateTodoUseCase(todoRepo);
  const deleteTodo = new DeleteTodoUseCase(todoRepo);

  const controller = new TodoController(createTodo, getTodos, updateTodo, deleteTodo);

  router.use(authMiddleware(tokenService));
  router.post('/', validate(createTodoSchema), controller.create);
  router.get('/', controller.getAll);
  router.put('/:id', validate(updateTodoSchema), controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
