import { useState, useEffect } from 'react'
import loginService from './services/login'
import Notification from './components/Notification'
import LogOrBlog from './components/LogOrBlog'
import { useDispatch } from 'react-redux'
import { newNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogsReducer'

const App = () => {
  const dispatch = useDispatch()
  const [user, setUser] = useState(null)

  useEffect(() => {
    dispatch(initializeBlogs())
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

  return (
    <div>
      <Notification />
      <LogOrBlog loginUser={loginUser} user={user} setUser={setUser} />
    </div>
  )
}

export default App
