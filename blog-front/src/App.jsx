import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LogOrBlog from './components/LogOrBlog'
import { useDispatch } from 'react-redux'
import { newNotification } from './reducers/notificationReducer'

const App = () => {
  const dispatch = useDispatch()
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const createBlogRef = useRef()

  useEffect(() => {
    async function getAllBlogs() {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    getAllBlogs()
  }, [])

  useEffect(() => {
    const loggedUserSTRING = window.localStorage.getItem('loggedUser')
    if (loggedUserSTRING) {
      const user = JSON.parse(loggedUserSTRING)
      setUser(user)
    }
  }, [])

  const loginUser = async ({ username, password }) => {
    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
    } catch (exeption) {
      if (exeption.response !== undefined) {
        dispatch(
          newNotification({
            message: exeption.response.data.error,
            success: 'error'
          })
        )
      } else {
        dispatch(
          newNotification({
            message: exeption.message,
            success: 'error'
          })
        )
      }
    }
  }

  const createBlog = async (blogObj) => {
    createBlogRef.current.toggleVisibility()
    try {
      const blog = await blogService.createBlog(user, blogObj)
      blog.user = user
      setBlogs(blogs.concat(blog))
      dispatch(
        newNotification({
          message: `a new blog "${blogObj.title}" by ${blogObj.author}, added`,
          success: 'success'
        })
      )
    } catch (exeption) {
      dispatch(
        newNotification({
          message: exeption.response.data.error,
          success: 'error'
        })
      )
    }
  }

  const updateBlogsAfterRemove = (blog) => {
    const newBlogs = blogs.filter((e) => e !== blog)
    setBlogs(newBlogs)
  }

  return (
    <div>
      <Notification />
      <LogOrBlog
        loginUser={loginUser}
        user={user}
        setUser={setUser}
        blogs={blogs}
        createBlog={createBlog}
        createBlogRef={createBlogRef}
        updateBlogsAfterRemove={updateBlogsAfterRemove}
      />
    </div>
  )
}

export default App
