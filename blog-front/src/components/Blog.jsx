import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { newNotification } from '../reducers/notificationReducer'
import { giveLike, removeBlog } from '../reducers/blogsReducer'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState('view')

  const handleButton = () => {
    if (visible === 'hide') {
      setVisible('view')
    } else {
      setVisible('hide')
    }
  }

  const handleLikeButton = async () => {
    try {
      console.log('userid', blog)
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
    if (blog.user.username === user.username) {
      return (
        <button className="removeBlog" onClick={handleRemove}>
          remove
        </button>
      )
    } else {
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

  const additionalInfo = () => {
    if (visible === 'hide') {
      console.log(blog.likes)
      return (
        <div>
          {blog.url}
          <br />
          likes: {blog.likes}
          <button onClick={handleLikeButton}>like</button>
          <br />
          {blog.user.name}
          <br />
          {removeButton()}
        </div>
      )
    }
    return null
  }

  return (
    <li>
      <div className="blogItem">
        {blog.title} {blog.author}
        <button onClick={handleButton} name={'view_Hide'}>
          {visible}
        </button>
        {additionalInfo(blog)}
      </div>
    </li>
  )
}

export default Blog
