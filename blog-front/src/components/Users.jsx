import { useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch
} from 'react-router-dom'

const Users = () => {
  const users = useSelector(({ users }) => {
    return users
  })

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <tbody>
          <tr>
            <td></td>
            <td>
              <strong>blogs created</strong>
            </td>
          </tr>
          {users.map((user) => (
            <tr key={user.username}>
              <td>
                {/* <Link to={`/users/${user.id}`} /> */}
                {user.name}
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
