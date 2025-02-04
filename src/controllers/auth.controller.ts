import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      name,
    }: { email: string; password: string; name: string } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    res.status(201).json({ user, token })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating user', error: (error as Error).message })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export default {
  register,
  login,
}
