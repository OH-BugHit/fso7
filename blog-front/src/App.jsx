import { useEffect } from 'react'
import Notification from './components/Notification'
import Menu from './components/Menu'
import { useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogsReducer'
import { saveUser } from './reducers/userReducer'
import { newNotification } from './reducers/notificationReducer'
import { initializeUsers } from './reducers/usersReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const load = async () => {
      try {
        await dispatch(initializeBlogs())
        await dispatch(initializeUsers())
      } catch (e) {
        dispatch(
          newNotification({
            message: e.message,
            messageType: 'error'
          })
        )
      }
    }
    load()
  }, [])

  useEffect(() => {
    const loggedUserSTRING = window.localStorage.getItem('loggedUser')
    if (loggedUserSTRING) {
      const user = JSON.parse(loggedUserSTRING)
      dispatch(saveUser(user))
    }
  }, [])

  return (
    <div className="container">
      <Notification />
      <Menu />
    </div>
  )
}

export default App
