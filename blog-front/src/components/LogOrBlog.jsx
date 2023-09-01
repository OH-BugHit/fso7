import Login from './Login'
import BlogList from './BlogList'
import { useRef } from 'react'
import { useSelector } from 'react-redux'

const LogOrBlog = () => {
  const user = useSelector(({ user }) => {
    return user
  })
  const createBlogRef = useRef()
  if (user === null) {
    return <Login />
  } else {
    return <BlogList createBlogRef={createBlogRef} />
  }
}

export default LogOrBlog
