const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const morgan = require('morgan')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch((error) => {
        logger.error(`Error connecting to MongoDB ${error}`)
    })

app.use(cors())
app.use(express.json())
app.use(morgan('\n---morgan\nMetodi\tStatus\tVastausaika \n:method\t:status\t:response-time ms\n-\nPituus\tUrl\n:res[content-length]\t:url\n-\nSisältö: :kontentti\n---morgan\n'))
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (config.CYPRESS_TEST === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}
morgan.token('kontentti', function (request) { return JSON.stringify(request.body) })
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app