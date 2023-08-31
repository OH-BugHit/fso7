import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const createBlog = async (user, newBlog) => {
  setToken(user.token)
  const headers = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, headers)
  return response.data
}

const addLike = async (user, blog) => {
  setToken(user.token)
  const headers = {
    headers: { Authorization: token }
  }
  const updateBlog = {
    user: blog.user.id,
    likes: blog.likes,
    author: blog.author,
    title: blog.title,
    url: blog.url
  }
  const response = await axios.put(`${baseUrl}/${blog.id}`, updateBlog, headers)
  return response.data
}

const deleteBlog = async (user, blog) => {
  setToken(user.token)
  const headers = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, headers)
  if (!response === null) { return response.data }
  return null
}

export default {
  getAll,
  createBlog,
  addLike,
  deleteBlog
}