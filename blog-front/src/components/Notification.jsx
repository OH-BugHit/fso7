import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({ notification }) => {
    return notification
  })

  if (notification) {
    if (notification.success === 'success') {
      return <div className="success">{notification.message}</div>
    } else {
      return <div className="error">{notification.message}</div>
    }
  }
  return null
}

export default Notification
