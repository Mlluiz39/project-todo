const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getAllTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    })
    res.json(todos)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching todos', error: error.message })
  }
}

const createTodo = async (req, res) => {
  try {
    const { title, description, userId } = req.body

    if (!title || !description || !userId) {
      return res
        .status(400)
        .json({ message: 'Title, description, and userId are required' })
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId,
      },
    })

    res.status(201).json(todo)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating todo', error: error.message })
  }
}

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params
    const { title, completed } = req.body

    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    })

    if (!todo || todo.userId !== req.user.userId) {
      return res.status(404).json({ message: 'Todo not found' })
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: { title, completed },
    })
    res.json(updatedTodo)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating todo', error: error.message })
  }
}

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params

    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    })

    if (!todo || todo.userId !== req.user.userId) {
      return res.status(404).json({ message: 'Todo not found' })
    }

    await prisma.todo.delete({
      where: { id: parseInt(id) },
    })
    res.status(204).send()
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting todo', error: error.message })
  }
}

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
}
