import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    resetNotification(state, action) {
      return null
    }
  }
})

export const newNotification = (content) => {
  return async (dispatch) => {
    dispatch(setNotification(content))
    setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)
  }
}
export const { setNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer
