import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getToken = () => {
  const loggedUserSTRING = window.localStorage.getItem('loggedUser')
  if (loggedUserSTRING) {
    const user = JSON.parse(loggedUserSTRING)
    return user
  }
  return null
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const createBlog = async (newBlog) => {
  const user = getToken() //tähän tulee se useSelector sit?
  setToken(user.token)
  const headers = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, headers)
  return response.data
}

const addLike = async (blog) => {
  //Put ei edellytä tokenia eli kokeile myös ilman kun periaatteessa turhaa tässä
  const user = getToken() //tähän tulee se useSelector sit?
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

const deleteBlog = async (blog) => {
  const user = getToken() //tähän tulee se useSelector sit?
  setToken(user.token)
  const headers = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, headers)
  if (!response === null) {
    return response.data
  }
  return null
}

export default {
  getAll,
  createBlog,
  addLike,
  deleteBlog
}
