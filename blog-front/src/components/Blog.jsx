import { useState } from 'react'
import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { newNotification } from '../reducers/notificationReducer'

const Blog = ({ blog, user, updateBlogsAfterRemove }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState('view')
  const [likes, setLikes] = useState(blog.likes)

  const handleButton = () => {
    if (visible === 'hide') {
      setVisible('view')
    } else {
      setVisible('hide')
    }
  }

  const handleLikeButton = async () => {
    const updateblog = { ...blog, likes: blog.likes + 1 }
    try {
      await blogService.addLike(user, updateblog)
      setLikes(likes + 1)
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
        await blogService.deleteBlog(user, blog)
        updateBlogsAfterRemove(blog)
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

  const additionalInfo = (blog) => {
    if (visible === 'hide') {
      return (
        <div>
          {blog.url}
          <br />
          likes: {likes}
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
