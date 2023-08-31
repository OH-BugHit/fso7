const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
    logger.info(`Server is running on port ${config.PORT}`)
})

//Kiitokset kurssista OH-BugHit