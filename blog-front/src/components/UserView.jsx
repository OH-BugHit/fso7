import { useSelector } from 'react-redux'

const UserView = ({ user }) => {
  if (!user) {
    console.log('tyhjä on')
    return null
  }

  const response = useSelector(({ blogs }) => {
    return blogs
  })

  const blogs = [...response].sort((a, b) => b.likes - a.likes)
  const usersBlogs = blogs.filter((blog) => blog.user.id === user.id)

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {usersBlogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserView
