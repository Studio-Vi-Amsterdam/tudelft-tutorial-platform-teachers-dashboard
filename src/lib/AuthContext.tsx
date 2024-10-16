import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { authAPI } from './api'
import { getAuthToken, removeAuthToken, setAuthToken } from './cookies'
import { fetchUsername } from './fetchUser'

interface AuthContextType {
  isAuthenticated: boolean
  login: (authKey: string) => Promise<void>
  logout: () => void
  username: string
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {
    console.log('Login')
  },
  logout: () => {
    console.log('Logout')
  },
  username: 'there',
})

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('there')

  const login = async (authKey: string) => {
    try {
      const data = await authAPI.auth(authKey).then((res) => res.data)
      if (data) {
        setAuthToken(data.data.token)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const logout = () => {
    removeAuthToken()
    window.location.replace(process.env.REACT_APP_HOMEPAGE_URL ?? '')
    setIsAuthenticated(false)
  }
  const searchParams = new URLSearchParams(window.location.search)
  const authKey = searchParams.get('auth_key')

  useEffect(() => {
    const getUsername = async () => {
      await fetchUsername(setUsername)
    }
    const fetchData = async () => {
      if (authKey) {
        await login(authKey)
        getUsername()
      } else {
        window.location.replace(process.env.REACT_APP_WP_ADMIN_URL ?? '')
      }
    }
    const token = getAuthToken()
    if (token) {
      setIsAuthenticated(true)
      getUsername()
    } else if (!token) {
      fetchData()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
