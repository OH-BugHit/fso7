import { useDispatch, useSelector } from 'react-redux'
import { newNotification } from '../reducers/notificationReducer'
import { giveLike, removeBlog } from '../reducers/blogsReducer'

const Blog = ({ blog }) => {
  if (!blog) {
    return null
  }
  const user = useSelector(({ user }) => {
    return user
  })

  const dispatch = useDispatch()

  const handleLikeButton = async () => {
    try {
      await dispatch(giveLike(blog))
      dispatch(
        newNotification({
          message: 'Like added',
          success: 'success'
        })
      )
    } catch (e) {
      var message = e.message
      if (e.message.includes('400')) {
        message = e.response.data.error
      }
      dispatch(
        newNotification({
          message: message,
          success: 'error'
        })
      )
    }
  }

  const removeButton = () => {
    if (user !== null) {
      if (blog.user.username === user.username) {
        return (
          <button className="removeBlog" onClick={handleRemove}>
            remove
          </button>
        )
      }
      return null
    }
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
      try {
        await dispatch(removeBlog(blog))
        dispatch(
          newNotification({
            message: `'${blog.title}' removed`,
            messageType: 'success'
          })
        )
      } catch (exeption) {
        if (exeption) {
          var message = exeption.message
          if (exeption.message.includes('400')) {
            message = exeption.response.data.error
          }
          dispatch(
            newNotification({
              message: message,
              success: 'error'
            })
          )
        }
      }
    } else {
      return null
    }
  }

  return (
    <div className="blogItem">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <br />
        likes: {blog.likes}
        {user !== null ? (
          <button onClick={handleLikeButton}>like</button>
        ) : (
          <></>
        )}
        <br />
        added by {blog.user.name}
        <br />
        {removeButton()}
      </div>
    </div>
  )
}

export default Blog
