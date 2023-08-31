import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import DisplayMessage from './components/DisplayMessage'
import Notification from './components/Notification'
import LogOrBlog from './components/LogOrBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notifyMessage, setNotifyMessage] = useState({
    message: null,
    messageType: 'success'
  })
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
        DisplayMessage(setNotifyMessage, {
          message: exeption.response.data.error,
          messageType: 'error'
        })
      } else {
        DisplayMessage(setNotifyMessage, {
          message: exeption.message,
          messageType: 'error'
        })
      }
    }
  }

  const createBlog = async (blogObj) => {
    createBlogRef.current.toggleVisibility()
    try {
      const blog = await blogService.createBlog(user, blogObj)
      blog.user = user
      setBlogs(blogs.concat(blog))
      DisplayMessage(setNotifyMessage, {
        message: `a new blog "${blogObj.title}" by ${blogObj.author}, added`,
        messageType: 'success'
      })
    } catch (exeption) {
      DisplayMessage(setNotifyMessage, {
        message: exeption.response.data.error,
        messageType: 'error'
      })
    }
  }

  const updateBlogsAfterRemove = (blog) => {
    const newBlogs = blogs.filter((e) => e !== blog)
    setBlogs(newBlogs)
  }

  return (
    <div>
      <Notification message={notifyMessage}></Notification>
      <LogOrBlog
        loginUser={loginUser}
        user={user}
        setUser={setUser}
        blogs={blogs}
        createBlog={createBlog}
        createBlogRef={createBlogRef}
        setNotifyMessage={setNotifyMessage}
        updateBlogsAfterRemove={updateBlogsAfterRemove}
      />
    </div>
  )
}

export default App
