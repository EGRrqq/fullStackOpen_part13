const express = require('express')
const app = express()
require('express-async-errors')

const middleware = require('./utils/middleware')
const morgan = require('morgan')

morgan.token('req-body', req => JSON.stringify(req.body))

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')

const blogsRouter = require('./controllers/blogs')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.use('/api/blogs', blogsRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

start()