const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todo.controller')

router.use(authMiddleware)

router.get('/', getAllTodos)
router.post('/', createTodo)
router.put('/:id', updateTodo)
router.delete('/:id', deleteTodo)

module.exports = router
