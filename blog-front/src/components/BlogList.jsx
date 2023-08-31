import { useSelector } from 'react-redux'
import Blog from './Blog'
import CreateBlog from './CreateBlog'
import Togglable from './Togglable'

const BlogList = ({ user, setUser, createBlogRef }) => {
  const blogs = useSelector(({ blogs }) => {
    return blogs
  })

  const handleLogOut = () => {
    window.localStorage.clear()
    setUser(null)
  }
  //Järjestetään likejen mukaan ennen renderöintiä
  // sortedBlogs.sort((a, b) => b.likes - a.likes)
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
