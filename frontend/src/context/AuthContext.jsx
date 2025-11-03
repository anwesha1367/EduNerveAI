import { createContext, useState, useEffect } from 'react'
import { login as apiLogin, signup as apiSignup } from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = sessionStorage.getItem('edunerve_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials)
      setUser(response.data.user)
      sessionStorage.setItem('edunerve_user', JSON.stringify(response.data.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await apiSignup(userData)
      setUser(response.data.user)
      sessionStorage.setItem('edunerve_user', JSON.stringify(response.data.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('edunerve_user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
