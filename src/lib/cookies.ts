import Cookies from 'js-cookie'

export const setAuthToken = (token: string) => {
  const expires = 1
  Cookies.set('tuDelft-token', token, { expires })
}

export const getAuthToken = (): string | undefined => {
  return Cookies.get('tuDelft-token')
}

export const removeAuthToken = () => {
  Cookies.remove('tuDelft-token')
  window.location.replace(process.env.REACT_APP_WP_ADMIN_URL ?? '')
}
