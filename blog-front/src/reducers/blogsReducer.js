import { createSlice } from '@reduxjs/toolkit'
import blogs from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    likeBlog(state, action) {
      const id = action.payload.id
      const blogToChange = state.find((n) => n.id === id)
      const changed = { ...blogToChange, likes: blogToChange.likes + 1 }
      return state.map((blog) => (blog.id !== id ? blog : changed))
    },
    createBlog(state, action) {
      state.push(action.payload)
    },
    deleteBlog(state, action) {
      const id = action.payload.id
      return state.filter((e) => e.id !== id)
    },
    commentBlog(state, action) {
      const id = action.payload.blog.id
      const blogToChange = state.find((n) => n.id === id)
      const changed = {
        ...blogToChange,
        comments: action.payload.blog.comments.concat(action.payload.comment)
      }
      return state.map((blog) => (blog.id !== id ? blog : changed))
    }
  }
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const initializeBlogs = await blogs.getAll()
    dispatch(setBlogs(initializeBlogs))
  }
}

export const giveLike = (blog) => {
  return async (dispatch) => {
    const updated = { ...blog, likes: Number(blog.likes + 1) }
    const liked = await blogs.addLike(updated)
    dispatch(likeBlog(liked))
  }
}

export const newBlog = (blog, user) => {
  return async (dispatch) => {
    const newBlog = await blogs.createBlog(blog)
    newBlog.user = { username: user.username, name: user.name }
    dispatch(createBlog(newBlog))
  }
}

export const removeBlog = (blog) => {
  return async (dispatch) => {
    await blogs.deleteBlog(blog)
    dispatch(deleteBlog(blog))
  }
}

export const addComment = (blog, comment) => {
  return async (dispatch) => {
    const commented = await blogs.addComment(blog.id, comment)
    dispatch(commentBlog({ blog: blog, comment: comment }))
  }
}

export const { setBlogs, likeBlog, createBlog, deleteBlog, commentBlog } =
  blogSlice.actions
export default blogSlice.reducer
