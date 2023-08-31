require('dotenv').config()

let PORT = 3003
let MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI
let CYPRESS_TEST = process.env.NODE_ENV
module.exports = {
    MONGODB_URI,
    PORT,
    CYPRESS_TEST
}