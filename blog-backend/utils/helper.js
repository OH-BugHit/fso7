const User = require("../models/users")

const getBlogsInDB = async (api) => {
    const response = await api.get('/api/blogs')
    return response
}

const getUsersInDB = async () => {
    const users = await User.find({})
    return (users)
}

module.exports = {
    getBlogsInDB,
    getUsersInDB
}