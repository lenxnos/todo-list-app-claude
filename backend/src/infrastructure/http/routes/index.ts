import { Router } from 'express';
import { createAuthRoutes } from './auth.routes.js';
import { createTodoRoutes } from './todo.routes.js';

export function createRoutes(): Router {
  const router = Router();

  router.use('/auth', createAuthRoutes());
  router.use('/todos', createTodoRoutes());

  return router;
}
