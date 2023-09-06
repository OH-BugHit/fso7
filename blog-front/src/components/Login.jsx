import { useState } from 'react'
import { useDispatch } from 'react-redux'
import loginService from '../services/login'
import { newNotification } from '../reducers/notificationReducer'
import { saveUser } from '../reducers/userReducer'
import { initializeBlogs } from '../reducers/blogsReducer'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loginUser = async () => {
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      dispatch(saveUser(user))
      //Uudelleen initialisointi tässä varuilta jos networkerror ollut ennen onnistunutta kirjautumista
      dispatch(initializeBlogs())
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

  const handleLogin = (event) => {
    event.preventDefault()
    loginUser({
      username: username,
      password: password
    })
    setUsername('')
    setPassword('')
    navigate('/')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            placeholder="type username here"
            autoComplete="username"
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            placeholder="type password here"
            autoComplete="current-password"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login
