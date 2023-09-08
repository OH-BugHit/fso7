const blogsRouter = require('express').Router()
const { response } = require('express')
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')
require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blog = await new Blog(request.body)

  if (!blog.title) {
    response.status(400).send({ error: 'Title undefined' })
  } else if (!blog.url) {
    response.status(400).send({ error: 'URL undefined' })
  } else {
    if (!blog.likes || blog.likes === '') {
      blog.likes = 0
    }

    const user = request.user
    blog.user = user._id

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if (user.blogs.toString().includes(request.params.id)) {
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  }
  response.status(401).send({ error: 'unauthorized user' })
})

blogsRouter.put('/:id', async (request, response) => {
  var { title, author, url, likes } = await request.body

  const updatedPerson = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true }
  )
  response.json(updatedPerson)
})

//Lisätään kommentti blogiin
blogsRouter.post('/:id/comments', async (request, response) => {
  const update = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      $push: {
        comments: request.body.comment
      }
    },
    { new: true }
  )
  response.json(update)
})

module.exports = blogsRouter
