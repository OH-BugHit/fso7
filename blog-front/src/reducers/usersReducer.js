import { createSlice } from '@reduxjs/toolkit'
import users from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const saveUser = (content) => {
  return async (dispatch) => {
    dispatch(setUsers(content))
  }
}

export const initializeUsers = () => {
  return async (dispatch) => {
    const initializeUsers = await users.getAll()
    dispatch(setUsers(initializeUsers))
  }
}

// export const clearUser = () => {
//   return async (dispatch) => {
//     dispatch(setUsers(null))
//   }
// }

export const { setUsers } = usersSlice.actions
export default usersSlice.reducer
