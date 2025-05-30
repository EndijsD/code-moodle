import { createContext, useContext, useEffect, useRef } from 'react'
import axios from 'axios'

const GlobalContext = createContext()
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {
  const refreshPooling = useRef()

  axios.defaults.baseURL = 'http://localhost:3000'
  axios.defaults.withCredentials = true

  useEffect(() => {
    const checkAuthAndStartRefresh = async () => {
      try {
        await axios.get('/auth/check') // Check if accessToken is valid

        // User is authenticated, start refresh interval
        const refresh = () => {
          axios.post('auth/refresh').catch(() => {
            clearInterval(refreshPooling.current)
          })
        }

        refresh() // Initial call
        refreshPooling.current = setInterval(refresh, 600000) // 10 min
      } catch (e) {
        // Not authenticated
      }
    }

    checkAuthAndStartRefresh()

    return () => clearInterval(refreshPooling.current)
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        refreshPooling,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
