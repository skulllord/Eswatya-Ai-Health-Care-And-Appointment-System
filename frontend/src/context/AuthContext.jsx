/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    console.log('AuthContext: Loading from localStorage...')
    const storedToken = localStorage.getItem('token')
    const storedUserType = localStorage.getItem('userType')
    const storedUser = localStorage.getItem('user')
    
    console.log('Stored values:', {
      token: storedToken ? storedToken.substring(0, 20) + '...' : 'null',
      userType: storedUserType,
      user: storedUser
    })
    
    if (storedToken && storedUserType && storedUser) {
      setToken(storedToken)
      setUserType(storedUserType)
      setUser(JSON.parse(storedUser))
      console.log('AuthContext: User restored from localStorage')
    } else {
      console.log('AuthContext: No stored session found')
    }
    
    setLoading(false)
  }, [])

  const login = async (username, password, userType) => {
    try {
      console.log('Login attempt:', { username, userType })
      const response = await apiLogin(username, password, userType)
      console.log('Login response:', response)
      
      setToken(response.access_token)
      setUserType(response.user_type)
      
      // Store in localStorage
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('userType', response.user_type)
      
      // Set user object (will be fetched from profile endpoint)
      const userObj = { username, userType: response.user_type }
      setUser(userObj)
      localStorage.setItem('user', JSON.stringify(userObj))
      
      console.log('Login successful, stored:', {
        token: response.access_token.substring(0, 20) + '...',
        userType: response.user_type,
        user: userObj
      })
      
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData, userType) => {
    try {
      const response = await apiRegister(userData, userType)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setUserType(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    localStorage.removeItem('user')
  }

  const value = {
    user,
    userType,
    token,
    loading,
    login,
    register,
    logout,
    setUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
