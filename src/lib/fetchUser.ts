import { userAPI } from './api'

export const fetchUsername = async (setUsername: (value: React.SetStateAction<string>) => void) => {
  try {
    const response = await userAPI
      .getUser()
      .then((res) => (res.data.first_name ? res.data.first_name : 'there'))
    setUsername(response)
  } catch (error) {
    return 'there'
  }
}
