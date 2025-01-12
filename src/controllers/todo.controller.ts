import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllTodos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todos = await prisma.todo.findMany({
      where: {  },
      orderBy: { createdAt: 'desc' },
    })
    res.json(todos)
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching todos',
      error: (error as Error).message,
    })
  }
}

export const createTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      userId,
    }: { title: string; description: string; userId: number } = req.body

    if (!title || !description || !userId) {
      res.status(400).json({
        message: 'Title, description, and userId are required',
      })
      return
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
    res.status(500).json({
      message: 'Error creating todo',
      error: (error as Error).message,
    })
  }
}

export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { title, completed }: { title?: string; completed?: boolean } =
      req.body

    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id, 10) },
    })

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' })
      return
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id, 10) },
      data: { title, completed },
    })

    res.json(updatedTodo)
  } catch (error) {
    res.status(500).json({
      message: 'Error updating todo',
      error: (error as Error).message,
    })
  }
}

export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id, 10) },
    })

    if (!todo || todo.userId !== parseInt(req.params.userId, 10)) {
      res.status(404).json({ message: 'Todo not found' })
      return
    }

    await prisma.todo.delete({
      where: { id: parseInt(id, 10) },
    })

    res.status(204).send()
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting todo',
      error: (error as Error).message,
    })
  }
}

export default {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
}
