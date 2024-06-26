import Cookies from 'js-cookie'

export const setAuthToken = (token: string, expire: number) => {
  const expires = new Date(expire * 1000)
  Cookies.set('tuDelft-token', token, { expires })
}

export const getAuthToken = (): string | undefined => {
  return Cookies.get('tuDelft-token')
}

export const removeAuthToken = () => {
  Cookies.remove('tuDelft-token')
}
