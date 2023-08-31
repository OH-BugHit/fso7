import { useState } from 'react'
import blogService from '../services/blogs'
import DisplayMessage from './DisplayMessage'

const Blog = ({ blog, user, setNotifyMessage, updateBlogsAfterRemove }) => {
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
    blog.likes++
    try {
      await blogService.addLike(user, blog)
      setLikes(likes + 1)
      DisplayMessage(setNotifyMessage, {
        message: 'Like added',
        messageType: 'success',
        length: 2000
      })
    } catch (exeption) {
      DisplayMessage(setNotifyMessage, {
        message: exeption.response.data.error,
        messageType: 'error'
      })
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
        DisplayMessage(setNotifyMessage, {
          message: `'${blog.title}' removed`,
          messageType: 'success'
        })
      } catch (exeption) {
        if (exeption) {
          DisplayMessage(setNotifyMessage, {
            message: exeption.message,
            messageType: 'error'
          })
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
