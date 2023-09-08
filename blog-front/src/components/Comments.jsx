import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { addComment } from '../reducers/blogsReducer'
import { useEffect } from 'react'

const Comments = ({ blog }) => {
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

  useEffect(() => {
    setComment('')
  }, [])

  const handleAddComment = async (event) => {
    event.preventDefault()
    try {
      dispatch(addComment(blog, comment))
    } catch (e) {
      console.log(e)
    }
    setComment('')
  }

  //Älä käytä jos muuttuva datasetti vaan toteuta silloin ID:t DB:ssä. Tässä kun lisätään vain loppuun niin pitäisi toimia tehokkaasti?
  var keyId = 0
  const getKey = () => {
    const newKey = String(keyId)
    keyId++
    return newKey
  }

  return (
    <div>
      <h3>Comments</h3>
      <form onSubmit={handleAddComment}>
        <div>
          <input
            type="text"
            value={comment}
            name="comment"
            onChange={({ target }) => setComment(target.value)}
            placeholder="type comment here"
          />
          <button className="createButton" type="submit">
            add comment
          </button>
        </div>
      </form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={getKey()} className="commentItem">
            {comment}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Comments
