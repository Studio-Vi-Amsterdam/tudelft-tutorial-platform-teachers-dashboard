import { userAPI } from './api'

export const fetchUsername = async () => {
  try {
    const response = await userAPI.getUser()
    return response
  } catch (error) {
    console.error(error)
  }
}
