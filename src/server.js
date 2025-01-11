require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const todoRoutes = require('./routes/todo.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
