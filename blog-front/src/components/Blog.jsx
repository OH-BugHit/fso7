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
      dispatch(giveLike(blog))
      dispatch(
        newNotification({
          message: 'Like added',
          success: 'success'
        })
      )
    } catch (e) {
      dispatch(
        newNotification({
          message: e.response.data.error,
          messageType: 'error'
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
        dispatch(removeBlog(blog))
        dispatch(
          newNotification({
            message: `'${blog.title}' removed`,
            messageType: 'success'
          })
        )
      } catch (exeption) {
        if (exeption) {
          dispatch(
            newNotification({
              message: exeption.message,
              messageType: 'error'
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
