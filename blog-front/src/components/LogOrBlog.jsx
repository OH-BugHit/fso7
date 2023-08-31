import Blog from './Blog'
import CreateBlog from './CreateBlog'
import Togglable from './Togglable'
import { useState } from 'react'

const LogOrBlog = ({
  loginUser,
  user,
  blogs,
  setUser,
  handleAddBlog,
  createBlog,
  createBlogRef,
  setNotifyMessage,
  updateBlogsAfterRemove
}) => {
  if (user === null) {
    return RenderLogin({ loginUser })
  } else {
    return renderBlogs({
      blogs,
      user,
      setUser,
      handleAddBlog,
      createBlog,
      createBlogRef,
      setNotifyMessage,
      updateBlogsAfterRemove
    })
  }
}

const RenderLogin = ({ loginUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    loginUser({
      username: username,
      password: password
    })
    setUsername('')
    setPassword('')
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
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const renderBlogs = ({
  blogs,
  user,
  setUser,
  createBlog,
  createBlogRef,
  setNotifyMessage,
  updateBlogsAfterRemove
}) => {
  const handleLogOut = () => {
    window.localStorage.clear()
    setUser(null)
  }
  //Järjestetään likejen mukaan ennen renderöintiä
  blogs.sort((a, b) => b.likes - a.likes)

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
        <CreateBlog createBlog={createBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          setNotifyMessage={setNotifyMessage}
          updateBlogsAfterRemove={updateBlogsAfterRemove}
        />
      ))}
    </div>
  )
}

export default LogOrBlog
