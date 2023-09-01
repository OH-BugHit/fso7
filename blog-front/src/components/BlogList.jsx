import { useDispatch, useSelector } from 'react-redux'
import Blog from './Blog'
import CreateBlog from './CreateBlog'
import Togglable from './Togglable'
import { clearUser } from '../reducers/userReducer'

const BlogList = ({ createBlogRef }) => {
  const dispatch = useDispatch()
  const response = useSelector(({ blogs }) => {
    return blogs
  })
  const blogs = [...response].sort((a, b) => b.likes - a.likes)
  const user = useSelector(({ user }) => {
    return user
  })

  const handleLogOut = () => {
    window.localStorage.clear()
    dispatch(clearUser())
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button className="logoutButton" onClick={handleLogOut}>
          logout
        </button>{' '}
      </p>
      <Togglable
        buttonLabel="new blog"
        hiddenLabel="cancel"
        ref={createBlogRef}
      >
        <CreateBlog createBlogRef={createBlogRef} user={user} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </div>
  )
}

export default BlogList
