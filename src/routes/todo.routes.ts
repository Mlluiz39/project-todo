import express from 'express'

import { authMiddleware } from '../middleware/auth.middleware'
import {
  getAllTodos,
  getIdTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todo.controller'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getAllTodos)
router.get('/:id', getIdTodo)
router.post('/', createTodo)
router.put('/:id', updateTodo)
router.delete('/:id', deleteTodo)

export default router
