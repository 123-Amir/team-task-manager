import React, { createContext, useContext, useState, useEffect } from 'react'
import api from './api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    const { user: userData, token: newToken } = response.data
    setUser(userData)
    setToken(newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', newToken)
    return userData
  }

  const signup = async (name, email, password) => {
    const response = await api.post('/api/auth/signup', { name, email, password })
    const { user: userData, token: newToken } = response.data
    setUser(userData)
    setToken(newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', newToken)
    return userData
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
