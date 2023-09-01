import { useEffect } from 'react'
import Notification from './components/Notification'
import LogOrBlog from './components/LogOrBlog'
import { useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogsReducer'
import { saveUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserSTRING = window.localStorage.getItem('loggedUser')
    if (loggedUserSTRING) {
      const user = JSON.parse(loggedUserSTRING)
      dispatch(saveUser(user))
    }
  }, [])

  return (
    <div>
      <Notification />
      <LogOrBlog />
    </div>
  )
}

export default App
