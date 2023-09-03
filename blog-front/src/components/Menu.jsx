import UserView from './UserView'
import Users from './Users'
import { useSelector } from 'react-redux'
import { useMatch, Link, Routes, Route } from 'react-router-dom'
import LogOrBlog from './LogOrBlog'
import Login from './Login'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }

  const users = useSelector(({ users }) => {
    return users
  })

  const match = useMatch('/users/:id')

  const user = match ? users.find((user) => user.id === match.params.id) : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<LogOrBlog />} />
        <Route path="/users/:id" element={<UserView user={user} />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  )
}

export default Menu
