import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { authAPI } from './api'
import { getAuthToken, removeAuthToken, setAuthToken } from './cookies'

interface AuthContextType {
  isAuthenticated: boolean
  login: (authKey: string) => Promise<void>
  logout: () => void
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
})

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

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
    setIsAuthenticated(false)
  }
  const searchParams = new URLSearchParams(window.location.search)
  const authKey = searchParams.get('auth_key')

  useEffect(() => {
    const fetchData = async () => {
      if (authKey) {
        await login(authKey)
      } else {
        window.location.replace(
          'https://alt.viamsterdam.dev/tudelft-tutorials-staging/wp/wp-admin/',
        )
      }
    }
    const token = getAuthToken()
    if (token) {
      setIsAuthenticated(true)
    } else if (!token) {
      fetchData()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
