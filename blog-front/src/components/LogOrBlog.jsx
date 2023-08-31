import Login from './Login'
import BlogList from './BlogList'
import { useRef } from 'react'

const LogOrBlog = ({ loginUser, user, setUser, createBlog }) => {
  const createBlogRef = useRef()
  if (user === null) {
    return <Login loginUser={loginUser} />
  } else {
    return (
      <BlogList
        user={user}
        setUser={setUser}
        createBlog={createBlog}
        createBlogRef={createBlogRef}
      />
    )
  }
}

export default LogOrBlog
