import 'dotenv/config'
import express, { Request, Response } from 'express'

import cors from 'cors'

import authRoutes from './routes/auth.routes'
import todoRoutes from './routes/todo.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!!!')
})

app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
