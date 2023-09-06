import UserView from './UserView'
import Users from './Users'
import { useSelector, useDispatch } from 'react-redux'
import { useMatch, Link, Routes, Route } from 'react-router-dom'
import BlogList from './BlogList'
import Blog from './Blog'
import Login from './Login'
import { clearUser } from '../reducers/userReducer'

const Menu = () => {
  const dispatch = useDispatch()
  const padding = {
    paddingRight: 5
  }

  const loggedUser = useSelector(({ user }) => {
    return user
  })

  const users = useSelector(({ users }) => {
    return users
  })

  const match = useMatch('/users/:id')

  const user = match ? users.find((user) => user.id === match.params.id) : null

  const blogs = useSelector(({ blogs }) => {
    return blogs
  })

  const matchBlog = useMatch('/blogs/:id')

  const blog = matchBlog
    ? blogs.find((blog) => blog.id === matchBlog.params.id)
    : null

  const handleLogOut = () => {
    window.localStorage.clear()
    dispatch(clearUser())
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        {loggedUser ? (
          <em>
            {loggedUser.name} logged in
            <button className="logoutButton" onClick={handleLogOut}>
              logout
            </button>
          </em>
        ) : (
          <Link to="/login">login</Link>
        )}
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<BlogList />} />
        <Route path="/users/:id" element={<UserView user={user} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/blogs/:id" element={<Blog blog={blog} />} />
      </Routes>
    </div>
  )
}

export default Menu
