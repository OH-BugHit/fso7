import { useDispatch, useSelector } from 'react-redux'
import CreateBlog from './CreateBlog'
import Togglable from './Togglable'
import { clearUser } from '../reducers/userReducer'
import { Link } from 'react-router-dom'
import { useRef } from 'react'

const BlogList = () => {
  const dispatch = useDispatch()
  const createBlogRef = useRef()
  const response = useSelector(({ blogs }) => {
    return blogs
  })
  const blogs = [...response].sort((a, b) => b.likes - a.likes)
  const user = useSelector(({ user }) => {
    return user
  })

  return (
    <div>
      <h2>blogs</h2>
      <p></p>
      <Togglable
        buttonLabel="new blog"
        hiddenLabel="cancel"
        ref={createBlogRef}
      >
        <CreateBlog createBlogRef={createBlogRef} user={user} />
      </Togglable>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList
