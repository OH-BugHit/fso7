import { useState } from 'react'
import { newBlog } from '../reducers/blogsReducer'
import { newNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const CreateBlog = ({ createBlogRef, user }) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleAddBlog = async (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const createBlog = async (blog) => {
    try {
      await dispatch(newBlog(blog, user))
      dispatch(
        newNotification({
          message: `a new blog "${blog.title}" by ${blog.author}, added`,
          success: 'success'
        })
      )
      createBlogRef.current.toggleVisibility()
    } catch (exeption) {
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

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={handleAddBlog}>
        <table>
          <tbody>
            <tr>
              <td>title:</td>
              <td>
                <input
                  type="text"
                  value={title}
                  name="title"
                  onChange={({ target }) => setTitle(target.value)}
                  placeholder="type title here"
                />
              </td>
            </tr>
            <tr>
              <td>author:</td>
              <td>
                <input
                  type="text"
                  value={author}
                  name="author"
                  onChange={({ target }) => setAuthor(target.value)}
                  placeholder="type author here"
                />
              </td>
            </tr>
            <tr>
              <td>url:</td>
              <td>
                <input
                  type="text"
                  name="url"
                  value={url}
                  onChange={({ target }) => setUrl(target.value)}
                  placeholder="type url here"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <button className="createButton" type="submit">
            create
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateBlog
